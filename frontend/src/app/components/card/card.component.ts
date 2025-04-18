
import { Component, Input }    from '@angular/core';
import { CommonModule }        from '@angular/common';
import { DomSanitizer, SafeHtml }
  from '@angular/platform-browser';
import { CARD_ICONS }        from '../icons';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() iconKey      = 'money';
  @Input() title        = '';
  @Input() value        = '';
  @Input() valueColor   = 'text-blue-gray-900';
  @Input() trendPercent = '';
  @Input() trendText    = '';
  @Input() trendColor   = 'text-green-500';
  @Input() gradientFrom = 'from-blue-600';
  @Input() gradientTo   = 'to-blue-400';
  @Input() shadowColor  = 'shadow-blue-500/40';

  constructor(private sanitizer: DomSanitizer) {}

  /** SVG inyectado con seguridad */
  get iconSvg(): SafeHtml {
    const raw = CARD_ICONS[this.iconKey] || '';
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  }
}
