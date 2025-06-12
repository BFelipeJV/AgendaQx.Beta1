'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Clock, FileCheck } from "lucide-react";
import { useState } from "react";

interface EndShiftButtonProps {
  onEndShift: (data: {
    closingSurgeon: string;
    closingTime: string;
    closingDate: string;
  }) => void;
}

export default function EndShiftButton({ onEndShift }: EndShiftButtonProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [closingSurgeon, setClosingSurgeon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEndShift = async () => {
    if (!closingSurgeon.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingrese el nombre del cirujano que cierra el turno.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    
    try {
      await onEndShift({
        closingSurgeon: closingSurgeon.trim(),
        closingTime: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        closingDate: now.toLocaleDateString('es-ES'),
      });

      toast({
        title: "Turno Finalizado",
        description: "El turno ha sido cerrado exitosamente.",
        action: (
          <div className="flex items-center text-green-500">
            <FileCheck className="mr-2 h-5 w-5" />
            <span>Éxito</span>
          </div>
        ),
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al cerrar el turno. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Clock className="h-4 w-4" />
          Terminar Turno
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar Turno</DialogTitle>
          <DialogDescription>
            Al finalizar el turno, se archivará la información de los pacientes operados, no quirúrgicos y novedades.
            Solo permanecerán visibles los pacientes pendientes por operar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="surgeon" className="text-right">
              Cirujano
            </Label>
            <Input
              id="surgeon"
              value={closingSurgeon}
              onChange={(e) => setClosingSurgeon(e.target.value)}
              className="col-span-3"
              placeholder="Nombre del cirujano que cierra"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleEndShift} 
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <FileCheck className="h-4 w-4" />
                Confirmar Cierre
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 