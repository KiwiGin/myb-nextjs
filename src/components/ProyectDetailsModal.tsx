import React from 'react';
import { Proyecto } from '@/models/proyecto';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProyectoDetails from '@/components/ProyectDetails';

interface ProjectDetailsModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  proyecto: Proyecto;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ open, onClose, proyecto }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] min-w-[80vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Proyecto</DialogTitle>
        </DialogHeader>
        <DialogDescription>
        </DialogDescription>
        <div>
          <ProyectoDetails proyecto={proyecto} />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => onClose(false)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;