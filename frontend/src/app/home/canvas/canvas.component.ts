import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { DragService } from "../../shared/services/drag.service";
import { Subject, takeUntil } from "rxjs";
import { CanvasService, Block } from "../../shared/services/canvas.service";
import {BlockComponent} from "../block/block.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  standalone: true,
  imports: [BlockComponent, NgForOf],
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private unsubscribe$ = new Subject<void>();
  blocks: Block[] = [];

  constructor(
    private dragService: DragService,
    private canvasService: CanvasService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d')!;
      this.canvasService.initCanvas(this.ctx, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.canvasService.initAnchors();
      this.blocks = this.canvasService.getBlocks();
      this.canvasService.drawAll();

      this.ngZone.runOutsideAngular(() => {
        this.dragService.dragMove$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(position => {
            this.canvasService.updateBlockPosition(this.dragService.currentDragId!, position.x, position.y);
            this.blocks = this.canvasService.getBlocks();
            this.canvasService.drawAll();
            this.cdr.detectChanges();
          });
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onPointerDown(event: PointerEvent): void {
    this.ngZone.runOutsideAngular(() => {
      const { x, y } = this.getCanvasCoordinates(event);
      const clickedAnchor = this.canvasService.findClickedAnchor(x, y);

      if (clickedAnchor) {
        this.canvasService.startLineDrag(clickedAnchor, x, y);
      } else {
        const block = this.canvasService.findClickedBlock(x, y);
        if (block) {
          const offsetX = x - block.x;
          const offsetY = y - block.y;
          this.dragService.startDrag(x, y, offsetX, offsetY, block.id);
          this.canvas.nativeElement.setPointerCapture(event.pointerId);
        }
      }
      this.cdr.detectChanges();
    });
  }

  onPointerMove(event: PointerEvent): void {
    this.ngZone.runOutsideAngular(() => {
      const { x, y } = this.getCanvasCoordinates(event);

      if (this.dragService.isDragging) {
        this.dragService.moveDrag(x, y);
      } else if (this.canvasService.isLineDragging) {
        this.canvasService.updateTempLine(x, y);
        this.canvasService.drawAll();
      }
      this.cdr.detectChanges();
    });
  }

  onPointerUp(event: PointerEvent): void {
    this.ngZone.runOutsideAngular(() => {
      const { x, y } = this.getCanvasCoordinates(event);

      if (this.canvasService.isLineDragging) {
        const endAnchor = this.canvasService.findClickedAnchor(x, y);
        if (endAnchor) {
          this.canvasService.createLine(endAnchor);
        }
        this.canvasService.endLineDrag();
        this.canvasService.drawAll();
      } else {
        this.dragService.endDrag();
      }

      this.canvas.nativeElement.releasePointerCapture(event.pointerId);
      this.cdr.detectChanges();
    });
  }

  onAnchorClicked(event: { anchorId: string, x: number, y: number }): void {
    const clickedAnchor = this.canvasService.findClickedAnchor(event.x, event.y);
    if (clickedAnchor) {
      this.canvasService.startLineDrag(clickedAnchor, event.x, event.y);
    }
  }

  private getCanvasCoordinates(event: PointerEvent): { x: number; y: number } {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
}
