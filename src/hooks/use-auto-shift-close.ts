import { useEffect, useRef } from 'react';
import { useToast } from './use-toast';

interface UseAutoShiftCloseProps {
  onAutoClose: () => Promise<void>;
  isShiftClosed: boolean;
}

export function useAutoShiftClose({ onAutoClose, isShiftClosed }: UseAutoShiftCloseProps) {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isShiftClosed) return;

    const scheduleAutoClose = () => {
      const now = new Date();
      const closeTime = new Date(now);
      closeTime.setHours(10, 0, 0, 0);

      // Si ya pasó la hora de cierre para hoy, programar para mañana
      if (now > closeTime) {
        closeTime.setDate(closeTime.getDate() + 1);
      }

      const timeUntilClose = closeTime.getTime() - now.getTime();

      timeoutRef.current = setTimeout(async () => {
        try {
          await onAutoClose();
          toast({
            title: "Turno Cerrado Automáticamente",
            description: "El turno ha sido cerrado automáticamente a las 10:00 AM.",
          });
        } catch (error) {
          console.error('Error en cierre automático:', error);
          toast({
            title: "Error en Cierre Automático",
            description: "Hubo un error al cerrar el turno automáticamente.",
            variant: "destructive",
          });
        }
      }, timeUntilClose);
    };

    scheduleAutoClose();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isShiftClosed, onAutoClose, toast]);
} 