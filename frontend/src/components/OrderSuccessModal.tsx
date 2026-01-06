import { CheckCircle, Download, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface OrderSuccessModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  customerName: string;
  receiptUuid: string;
}

export function OrderSuccessModal({ open, onClose, orderId, customerName, receiptUuid }: OrderSuccessModalProps) {
  const receiptUrl = `${window.location.origin}/receipt/${receiptUuid}`;

  const handleDownloadPDF = () => {
    // In production, this would generate/download a PDF
    window.open(receiptUrl, '_blank');
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Dear ${customerName},\n\nThank you for your order!\n\nOrder ID: ${orderId}\n\nView your receipt: ${receiptUrl}\n\n- StitchCraft Tailors`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="h-16 w-16 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-status-success" />
          </div>
          <DialogTitle className="text-2xl">Order Confirmed!</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-muted-foreground mb-2">
            Order <span className="font-semibold text-foreground">{orderId}</span> has been created successfully for
          </p>
          <p className="text-lg font-semibold text-foreground">{customerName}</p>
        </div>

        <div className="space-y-3 pt-2">
          <Button 
            onClick={handleDownloadPDF}
            className="w-full h-12 rounded-xl gap-2"
            variant="outline"
          >
            <Download className="h-5 w-5" />
            Download Receipt (PDF)
          </Button>
          
          <Button 
            onClick={handleShareWhatsApp}
            className="w-full h-12 rounded-xl gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white"
          >
            <MessageCircle className="h-5 w-5" />
            Share via WhatsApp
          </Button>

          <Button 
            onClick={onClose}
            variant="ghost"
            className="w-full h-11 rounded-xl text-muted-foreground"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
