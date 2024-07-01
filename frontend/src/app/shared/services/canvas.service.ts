import { Injectable } from '@angular/core';

interface Point {
  x: number;
  y: number;
}

interface Square {
  x: number;
  y: number;
  size: number;
  id: number;
  anchors: Anchor[];
}

interface Anchor {
  id: string;
  squareId: number;
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
  private squares: Square[] = [
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
    this.squares.forEach(square => {
      square.anchors = this.createAnchorsForSquare(square);
    });
    this.anchors = this.squares.flatMap(square => square.anchors);
  }

  updateSquarePosition(squareId: number, newX: number, newY: number): void {
    const square = this.squares.find(s => s.id === squareId);
    if (square) {
      square.x = newX;
      square.y = newY;
      square.anchors = this.createAnchorsForSquare(square);
      this.anchors = this.squares.flatMap(s => s.anchors);
    }
  }

  drawAll(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.lines.forEach(line => this.drawLine(line));
      if (this.tempLine) {
        this.drawTempLine(this.tempLine);
      }
      this.squares.forEach(square => this.drawSquare(square));
      this.anchors.forEach(anchor => this.drawAnchor(anchor));
    }
  }

  findClickedAnchor(x: number, y: number): Anchor | undefined {
    return this.anchors.find(anchor =>
      Math.abs(anchor.x - x) < 5 && Math.abs(anchor.y - y) < 5
    );
  }

  findClickedSquare(x: number, y: number): Square | undefined {
    return this.squares.find(square =>
      x > square.x && x < square.x + square.size &&
      y > square.y && y < square.y + square.size
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
    if (this.dragStartAnchor && this.dragStartAnchor.squareId !== endAnchor.squareId) {
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

  private createAnchorsForSquare(square: Square): Anchor[] {
    return [
      { id: `${square.id}-left`, squareId: square.id, x: square.x, y: square.y + square.size / 2 },
      { id: `${square.id}-right`, squareId: square.id, x: square.x + square.size, y: square.y + square.size / 2 },
      { id: `${square.id}-top`, squareId: square.id, x: square.x + square.size / 2, y: square.y },
      { id: `${square.id}-bottom`, squareId: square.id, x: square.x + square.size / 2, y: square.y + square.size }
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

  private drawSquare(square: Square): void {
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(square.x, square.y, square.size, square.size);
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
