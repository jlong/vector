import d3 from 'd3/d3.min.js';

export default function main() {
  var black = '#34495e';
  var white = '#fff';
  var blue = '#3498db';
  var red = '#e74c3c';
  var silver = '#bdc3c7';

  class Canvas {
    constructor(element) {
      this.el = d3.select(element);
      this.el.on('mousedown', this.mousedown.bind(this));
      this.el.on('mousemove', this.mousemove.bind(this));
      this.el.on('mouseup', this.mouseup.bind(this));
      this.currentPath = null;
      this.handles = [];
    }

    path() {
      var path = new Path(this);
      return path;
    }

    mousedown() {
      var target = d3.select(d3.event.target);
      if (target.classed('drag-handle')) {
        target
        .attr('fill', white)
        .attr('stroke', black)
        ;
      } else {
        if (!this.currentPath) { this.currentPath = this.path(); }
        var [x,y] = d3.mouse(this.el.node());
        this.currentPath.addPoint(x,y);
        this.updatePath();
        this.creatingControlPoint = true;
      }
    }

    mousemove() {
      if (this.creatingControlPoint) {
        this.updatePath();
      }
    }

    mouseup() {
      this.updatePath();
      this.creatingControlPoint = false;
    }

    updatePath() {
      if (this.currentPath) {
        var path = this.currentPath;
        var point = path.lastPoint;
        if (point) {
          var h1 = point.h1;
          var h2 = point.h2;
          [h2.x, h2.y] = d3.mouse(this.el.node());
          h1.x = point.x - (h2.x - point.x);
          h1.y = point.y - (h2.y - point.y);
        }
        path.draw();
      }
    }

    addDragHandle(point) {
      var handle = this.el.append('circle')
      .classed('drag-handle', true)
      .attr('fill', black)
      .attr('stroke', white)
      .attr('stroke-width', 1)
      .attr('r', 5)
      .attr('cx', point.x)
      .attr('cy', point.y)
      ;
      return handle;
    }

    addDragHandles(controlPoint) {
      this.addLine(controlPoint, controlPoint.h1);
      this.addLine(controlPoint, controlPoint.h2);
      this.addDragHandle(controlPoint);
      this.addDragHandle(controlPoint.h1);
      this.addDragHandle(controlPoint.h2);
    }

    clearDragHandles() {
      this.el.selectAll('circle').remove();
      this.el.selectAll('line').remove();
    }

    addLine(p1, p2) {
      var line = this.el.append('line')
      .attr('stroke', silver)
      .attr('stroke-width', 1)
      .attr('x1', p1.x)
      .attr('y1', p1.y)
      .attr('x2', p2.x)
      .attr('y2', p2.y)
      ;
    }

    endPath() {
      this.currentPath = null;
      this.clearDragHandles();
    }

    reset() {
      this.endPath();
      this.el.html('');
    }

  }

  class Point {
    constructor(x,y) {
      this.x = x;
      this.y = y;
    }
  }

  class ControlPoint extends Point {
    constructor(x,y) {
      super(x,y);
      this.h1 = new Point(x,y);
      this.h2 = new Point(x,y);
    }
  }

  class Path {
    constructor(canvas) {
      this.canvas = canvas;
      this.el = canvas.el.append('path')
      .attr('fill', 'none')
      .attr('stroke', red)
      .attr('stroke-width', 6)
      ;
      this.points = [];
    }

    addPoint(x,y) {
      var point = new ControlPoint(x,y);
      this.points.push(point)
      return point;
    }

    get firstPoint() {
      return this.points[0];
    }

    get lastPoint() {
      return this.points[this.points.length - 1];
    }

    toString() {
      var commands = [];
      var pairs = [];
      this.points.forEach((left, i) => {
        var right = this.points[i + 1];
        if (right) {
          if (i === 0) { commands.push('M ' + left.x + ',' + left.y); }
          commands.push('C ' + left.h2.x + ',' + left.h2.y + ' ' + right.h1.x + ',' + right.h1.y + ' ' + right.x + ',' + right.y);
        }
      });
      return commands.join(' ');
    }

    draw() {
      this.el.attr('d', this.toString());
      this.canvas.clearDragHandles();
      this.points.forEach((point) => {
        this.canvas.addDragHandles(point);
      });
    }

    reset() {
      this.points = [];
      this.draw();
    }
  }

  var canvas = new Canvas('svg');

  d3.select('[data-reset]').on('click', function() {
    canvas.reset();
  });

  d3.select('[data-end-path]').on('click', function() {
    canvas.endPath();
  });
}
