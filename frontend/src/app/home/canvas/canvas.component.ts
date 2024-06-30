import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {DragService} from "../../shared/services/drag.service";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  standalone: true,
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private square = { x: 50, y: 50, size: 50 };

  constructor(private dragService: DragService) {}

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d')!;
      this.drawSquare();

      this.dragService.dragMove$.subscribe(position => {
        this.square.x = position.x;
        this.square.y = position.y;
        this.drawSquare();
      });
    }
  }

  private drawSquare() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.ctx.fillStyle = 'blue';
      this.ctx.fillRect(this.square.x, this.square.y, this.square.size, this.square.size);
    }
  }

  private startDrag(x: number, y: number, clientX: number, clientY: number) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const offsetX = clientX - rect.left - this.square.x;
    const offsetY = clientY - rect.top - this.square.y;

    if (x > this.square.x && x < this.square.x + this.square.size &&
      y > this.square.y && y < this.square.y + this.square.size) {
      this.dragService.startDrag(clientX - rect.left, clientY - rect.top, offsetX, offsetY);
    }
  }

  onPointerDown(event: MouseEvent) {
    this.startDrag(event.clientX - this.canvas.nativeElement.getBoundingClientRect().left,
      event.clientY - this.canvas.nativeElement.getBoundingClientRect().top,
      event.clientX, event.clientY);
  }

  onPointerMove(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.dragService.moveDrag(event.clientX - rect.left, event.clientY - rect.top);
  }

  onPointerUp() {
    this.dragService.endDrag();
  }

  onTouchStart(event: TouchEvent) {
    console.log("start")
    event.preventDefault();
    const touch = event.touches[0];
    this.startDrag(touch.clientX - this.canvas.nativeElement.getBoundingClientRect().left,
      touch.clientY - this.canvas.nativeElement.getBoundingClientRect().top,
      touch.clientX, touch.clientY);
  }

  onTouchMove(event: TouchEvent) {
    console.log("move")
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.dragService.moveDrag(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  onTouchEnd() {
    console.log("end")
    this.dragService.endDrag();
  }
}
