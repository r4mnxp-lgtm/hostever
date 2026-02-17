import React, { createContext, useState, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LeadCaptureForm from '@/components/LeadCaptureForm';

const LeadFormContext = createContext();

export const useLeadForm = () => useContext(LeadFormContext);

export const LeadFormProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLeadForm = () => setIsOpen(true);
  const closeLeadForm = () => setIsOpen(false);

  return (
    <LeadFormContext.Provider value={{ openLeadForm }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[550px]">
          <LeadCaptureForm onSuccess={closeLeadForm} />
        </DialogContent>
      </Dialog>
    </LeadFormContext.Provider>
  );
};