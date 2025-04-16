import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  /**
   * @param message El texto a mostrar.
   * @param type 'success' | 'error' para definir color.
   * @param duration Tiempo en milisegundos antes de ocultar (por defecto 3s).
   */
  show(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
    // 1. Crear el contenedor
    const toast = document.createElement('div');
    toast.innerText = message;

    // 2. Aplicar estilos Tailwind
    toast.className = [
      'fixed', 'top-4', 'right-4', 'max-w-xs', 'w-auto',
      'px-4', 'py-2', 'rounded', 'shadow-lg', 'text-white',
      'flex', 'items-center', 'opacity-100', 'transition-opacity',
      'duration-500', 'ease-in-out'
    ].join(' ');

    // Color según tipo
    if (type === 'success') {
      toast.classList.add('bg-green-500');
    } else {
      toast.classList.add('bg-red-500');
    }

    // 3. Añadir al body
    document.body.appendChild(toast);

    // 4. Auto‐ocultar tras 'duration'
    setTimeout(() => {
      // Iniciar transición de desaparición
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0');
      // Eliminar del DOM al terminar la transición
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 500);
    }, duration);
  }
}
