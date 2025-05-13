import jsPDF from 'jspdf';
import dayjs from 'dayjs';

export const generateInvoicePDF = (record) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Invoice ${record.invoiceNumber}`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Customer: ${record.customerName}`, 20, 40);
  doc.text(`Service: ${record.selectedService}`, 20, 50);
  doc.text(`Phone: ${record.customerPhone}`, 20, 60);
  doc.text(`Date: ${dayjs(record.date).format('YYYY-MM-DD')}`, 20, 70);
  doc.text(`Delivery: ${dayjs(record.expectedDeliveryDate).format('YYYY-MM-DD')}`, 20, 80);
  //doc.text(`Status: ${record.status}`, 20, 90);
  doc.text('Items:', 20, 110);
  let yPosition = 120;
  record.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.itemName} - Quantity: ${item.quantity}, Price: $${item.price}`,
      20,
      yPosition
    );
    yPosition += 10;
  });
  doc.save(`invoice_${record.invoiceNumber}.pdf`);
};