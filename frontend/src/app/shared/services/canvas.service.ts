import { Injectable } from '@angular/core';

interface Point {
  x: number;
  y: number;
}

export interface Block {
  x: number;
  y: number;
  size: number;
  id: number;
  anchors: Anchor[];
}

export interface Anchor {
  id: string;
  blockId: number;
  x: number;
  y: number;
}

interface Line {
  startAnchorId: string;
  endAnchorId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private ctx!: CanvasRenderingContext2D;
  private canvasWidth!: number;
  private canvasHeight!: number;
  private blocks: Block[] = [
    { x: 50, y: 50, size: 50, id: 1, anchors: [] },
    { x: 200, y: 200, size: 50, id: 2, anchors: [] }
  ];
  private anchors: Anchor[] = [];
  private lines: Line[] = [];
  private dragStartAnchor: Anchor | null = null;
  private tempLine: { start: Point; end: Point } | null = null;

  initCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.ctx = ctx;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  initAnchors(): void {
    this.blocks.forEach(block => {
      block.anchors = this.createAnchorsForBlock(block);
    });
    this.anchors = this.blocks.flatMap(block => block.anchors);
  }

  updateBlockPosition(blockId: number, newX: number, newY: number): void {
    const block = this.blocks.find(b => b.id === blockId);
    if (block) {
      block.x = newX;
      block.y = newY;
      block.anchors = this.createAnchorsForBlock(block);
      this.anchors = this.blocks.flatMap(b => b.anchors);
    }
  }

  drawAll(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.lines.forEach(line => this.drawLine(line));
      if (this.tempLine) {
        this.drawTempLine(this.tempLine);
      }
      this.blocks.forEach(block => this.drawBlock(block));
      this.anchors.forEach(anchor => this.drawAnchor(anchor));
    }
  }

  findClickedAnchor(x: number, y: number): Anchor | undefined {
    return this.anchors.find(anchor =>
      Math.abs(anchor.x - x) < 5 && Math.abs(anchor.y - y) < 5
    );
  }

  findClickedBlock(x: number, y: number): Block | undefined {
    return this.blocks.find(block =>
      x > block.x && x < block.x + block.size &&
      y > block.y && y < block.y + block.size
    );
  }

  startLineDrag(anchor: Anchor, x: number, y: number): void {
    this.dragStartAnchor = anchor;
    this.tempLine = { start: { x: anchor.x, y: anchor.y }, end: { x, y } };
  }

  updateTempLine(x: number, y: number): void {
    if (this.tempLine) {
      this.tempLine.end = { x, y };
    }
  }

  createLine(endAnchor: Anchor): void {
    if (this.dragStartAnchor && this.dragStartAnchor.blockId !== endAnchor.blockId) {
      this.lines.push({
        startAnchorId: this.dragStartAnchor.id,
        endAnchorId: endAnchor.id
      });
    }
  }

  endLineDrag(): void {
    this.dragStartAnchor = null;
    this.tempLine = null;
  }

  get isLineDragging(): boolean {
    return this.dragStartAnchor !== null;
  }

  getBlocks(): Block[] {
    return this.blocks;
  }

  private createAnchorsForBlock(block: Block): Anchor[] {
    return [
      { id: `${block.id}-left`, blockId: block.id, x: block.x, y: block.y + block.size / 2 },
      { id: `${block.id}-right`, blockId: block.id, x: block.x + block.size, y: block.y + block.size / 2 },
      { id: `${block.id}-top`, blockId: block.id, x: block.x + block.size / 2, y: block.y },
      { id: `${block.id}-bottom`, blockId: block.id, x: block.x + block.size / 2, y: block.y + block.size }
    ];
  }

  private drawTempLine(line: { start: Point; end: Point }): void {
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(line.start.x, line.start.y);
    this.ctx.lineTo(line.end.x, line.end.y);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  private drawBlock(block: Block): void {
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(block.x, block.y, block.size, block.size);
  }

  private drawLine(line: Line): void {
    const startAnchor = this.anchors.find(a => a.id === line.startAnchorId);
    const endAnchor = this.anchors.find(a => a.id === line.endAnchorId);
    if (startAnchor && endAnchor) {
      this.ctx.strokeStyle = 'black';
      this.ctx.beginPath();
      this.ctx.moveTo(startAnchor.x, startAnchor.y);
      this.ctx.lineTo(endAnchor.x, endAnchor.y);
      this.ctx.stroke();
    }
  }

  private drawAnchor(anchor: Anchor): void {
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(anchor.x, anchor.y, 5, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}
