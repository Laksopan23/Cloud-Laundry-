// utils/pdfGenerator.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (order) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Laundry Service Invoice', 14, 22);

  doc.setFontSize(12);
  doc.text(`Invoice Number: ${order.invoiceNumber}`, 14, 32);
  doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 14, 40);

  doc.autoTable({
    startY: 50,
    head: [['Field', 'Value']],
    body: [
      ['Customer Name', order.customerName],
      ['Customer Address 1', order.Addressline1],
      ['Customer Address 2', order.Addressline2 || ''],
      ['Customer Phone', order.customerPhone],
      ['Selected Service', order.selectedService],
      ['Expected Delivery Date', new Date(order.expectedDeliveryDate).toLocaleDateString()],
      ['Time', order.time],
      ['Pickup Fee', order.pickupFee],
      ['Pickup Discount', order.pickupDiscount],
      ['Note', order.note || ''],
      ['Pickup Person Name', order.pickupPersonName],
      ['Pickup Person Phone', order.pickupPersonPhone],
    ],
  });

  doc.save(`invoice_${order.invoiceNumber}.pdf`);
};
