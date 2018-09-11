import { Directive, ElementRef, HostListener, Input, OnInit, Renderer} from '@angular/core';

// Directive decorator
@Directive({
    selector: '[Capitalize]'
})
// Directive class
export class CapitalizeDirective implements OnInit {
  @Input() name: string;
  @Input() value: string;
  constructor(private el: ElementRef, private renderer: Renderer) {
  }
  ngOnInit() {
  }
  @HostListener('keyup') onKeyUp() {
    // this.el.nativeElement.value = this.el.nativeElement.value.charAt(0).toUpperCase() + this.el.nativeElement.value.slice(1);

    this.el.nativeElement.value = this.el.nativeElement.value.replace(/\b(\w)/g, s => s.toUpperCase());

  }
}
