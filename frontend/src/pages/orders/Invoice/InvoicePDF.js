import jsPDF from 'jspdf';
import dayjs from 'dayjs';
import 'jspdf-font';

// Add Poppins font
const poppinsRegular = require('./fonts/Poppins-Regular.ttf');
const poppinsBold = require('./fonts/Poppins-Bold.ttf');

export const generateInvoicePDF = (record) => {
  const doc = new jsPDF();
  
  // Add Poppins fonts to the document
  doc.addFont(poppinsRegular, 'Poppins', 'normal');
  doc.addFont(poppinsBold, 'Poppins', 'bold');
  
  // Set default font to Poppins
  doc.setFont('Poppins');
  
  // Set fonts and title
  doc.setFont('Poppins', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(86, 40, 195); // Purple
  doc.text('CLOUD LAUNDRY.LK', 140, 20);
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('504 weliwita Rd, Malabe', 140, 27);

  // Invoice Info
  doc.setFontSize(10);
  doc.text(`IN: ${record.invoiceNumber}`, 140, 35);
  doc.text(`Date: ${dayjs(record.date).format('DD MMM YYYY, h:mm A')}`, 140, 42);

  // Customer Info
  doc.setFont('Poppins', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE TO', 20, 35);
  doc.setFont('Poppins', 'normal');
  doc.text(`${record.customerName}`, 20, 42);
  doc.text(`${record.customerID || ''}`, 20, 48);
  doc.text(`${record.customerPhone}`, 20, 54);
  doc.text(`${record.customerAddress1}`, 20, 60);

  // Table headers
  let startY = 75;
  doc.setFont('Poppins', 'bold');
  doc.setFillColor(86, 40, 195);
  doc.setTextColor(255, 255, 255);
  doc.rect(20, startY, 170, 10, 'F');
  doc.text('#', 22, startY + 7);
  doc.text('SERVICE DESCRIPTION', 30, startY + 7);
  doc.text('WEIGHT/UNIT', 115, startY + 7);
  doc.text('PRICE', 145, startY + 7);
  doc.text('TOTAL', 170, startY + 7, { align: 'right' });

  // Table rows
  let y = startY + 15;
  doc.setFont('Poppins', 'normal');
  doc.setTextColor(0, 0, 0);
  record.items.forEach((item, index) => {
    doc.text(`${index + 1}`, 22, y);
    doc.text(`${item.itemName}`, 30, y);
    doc.text(`${item.quantity || '-'}`, 120, y);
    doc.text(`${item.price ? item.price.toFixed(2) : '-'}`, 145, y);
    const total = item.price ? (item.price * (item.quantity || 1)).toFixed(2) : '-';
    doc.text(`${total}`, 170, y, { align: 'right' });
    y += 10;
  });

  // Subtotal and Total
  const subtotal = record.items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  y += 10;
  doc.text(`SUB TOTAL`, 140, y);
  doc.text(subtotal.toFixed(2), 190, y, { align: 'right' });

  y += 7;
  doc.text(`Discount`, 140, y);
  doc.text('0.00', 190, y, { align: 'right' });

  y += 10;
  doc.setFillColor(86, 40, 195);
  doc.setTextColor(255, 255, 255);
  doc.rect(140, y, 50, 10, 'F');
  doc.text('TOTAL :', 145, y + 7);
  doc.text(`Rs ${subtotal.toFixed(2)}`, 190, y + 7, { align: 'right' });

  // Notes
  y += 20;
  doc.setFont('Poppins', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('NOTES:', 20, y);
  doc.setFont('Poppins', 'normal');
  doc.text('Curtains - Premium Service Package (Pickup, delivery, cleaning, pressing, and installation)', 20, y + 7);

  // Payment Info
  y += 20;
  doc.setFont('Poppins', 'bold');
  doc.text('Please make the payment using one of the following methods:', 20, y);
  y += 10;
  doc.setFont('Poppins', 'bold');
  doc.text('1. Bank Transfer', 20, y);
  doc.setFont('Poppins', 'normal');
  doc.text('Account Name: [Your Account Name]', 20, y + 7);
  doc.text('Account Number: [Your Account Number]', 20, y + 14);
  doc.text('Bank Name: [Bank Name]', 20, y + 21);
  doc.text('Branch: [Branch Name, if needed]', 20, y + 28);
  doc.text('SWIFT/IFSC Code: [If applicable]', 20, y + 35);

  y += 7;
  doc.setFont('Poppins', 'bold');
  doc.text('2. Cash Payment', 120, y);
  doc.setFont('Poppins', 'normal');
  doc.text('You may also make your payment in cash.', 120, y + 7);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('www.cloudlaundry.lk', 20, 280);
  doc.text('+94 76 180 4110', 90, 280);
  doc.text('hello@cloudlaundry.lk', 140, 280);
  doc.setTextColor(150, 100, 200);
  doc.text('- - Your Curtains Deserve The Best - -', 70, 286);

  doc.save(`invoice_${record.invoiceNumber}.pdf`);
};
