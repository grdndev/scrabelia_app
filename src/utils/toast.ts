import { Alert, Platform } from 'react-native';

// Système de toast simple pour React Native
// Utilise Alert.alert pour iOS/Android
// Pour une solution plus avancée, vous pouvez utiliser react-native-toast-message

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
}

class Toast {
  show(message: string, type: ToastType = 'info', options?: ToastOptions) {
    if (Platform.OS === 'web') {
      // Pour le web, on pourrait utiliser une bibliothèque comme sonner
      console.log(`[${type.toUpperCase()}] ${message}`);
      return;
    }

    // Pour mobile, on utilise Alert
    const title = this.getTitle(type);
    Alert.alert(title, message);
  }

  success(message: string, options?: ToastOptions) {
    this.show(message, 'success', options);
  }

  error(message: string, options?: ToastOptions) {
    this.show(message, 'error', options);
  }

  info(message: string, options?: ToastOptions) {
    this.show(message, 'info', options);
  }

  warning(message: string, options?: ToastOptions) {
    this.show(message, 'warning', options);
  }

  private getTitle(type: ToastType): string {
    switch (type) {
      case 'success':
        return '✅ Succès';
      case 'error':
        return '❌ Erreur';
      case 'warning':
        return '⚠️ Attention';
      default:
        return 'ℹ️ Information';
    }
  }
}

export const toast = new Toast();


