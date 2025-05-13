import html2pdf from 'html2pdf.js';
import dayjs from 'dayjs';
import logo from '../../../images/logo.png';
import laundry from '../../../images/laundry.png';

export const generateInvoicePDF = (record) => {
  const invoiceHTML = `
    <div style="font-family: 'Poppins', sans-serif; max-width: 900px; margin: 0 auto; background: #fff; position: relative; overflow: hidden; display: flex; flex-direction: column; min-height: 100vh;">
      <!-- Watermark -->
      <img src="${logo}" style="position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); opacity: 0.08; z-index: 0; width: 70%; pointer-events: none;" />

      <!-- Content Wrapper for Sticky Footer -->
      <div style="flex: 1; display: flex; flex-direction: column; z-index: 1;">

        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 24px 24px 0 24px;">
          <div style="display: flex; align-items: center;">
            <img src="${logo}" alt="Logo" style="height: 60px; margin-right: 12px;" />
            <div>
              <span style="font-size: 13px; color: #5628C3; font-weight: 600;">Cloud Laundry.lk</span>
            </div>
          </div>
          <div style="text-align: right;">
            <h1 style="color: #5628C3; margin: 0; font-size: 24px; font-weight: 700;">CLOUD LAUNDRY.LK</h1>
            <p style="margin: 0; font-size: 13px;">504 weliwita Rd, Malabe</p>
            <p style="margin: 0; font-size: 13px;">IN: ${record.invoiceNumber}</p>
            <p style="margin: 0; font-size: 13px;">Date: ${dayjs(record.date).format('DD MMM YYYY, h:mm A')}</p>
          </div>
        </div>

        <!-- Invoice To & Illustration -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 0 24px; margin-top: 16px;">
          <div>
            <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">INVOICE TO</div>
            <div style="font-size: 14px; font-weight: 600; text-transform: uppercase;">${record.customerName}</div>
            <div style="font-size: 13px;">${record.customerID || ''}</div>
            <div style="font-size: 13px;">${record.customerPhone}</div>
            <div style="font-size: 13px;">${record.customerAddress1}</div>
          </div>
          <img src="${laundry}" alt="Bucket" style="height: 80px; margin-left: 24px;" />
        </div>

        <!-- Table -->
        <div style="padding: 24px; padding-bottom: 0;">
          <table style="width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px;">
            <thead>
              <tr style="background: #7C3AED; color: #fff; border-radius: 8px;">
                <th style="padding: 12px 8px; border-top-left-radius: 8px;">#</th>
                <th style="padding: 12px 8px;">SERVICE DESCRIPTION</th>
                <th style="padding: 12px 8px;">WEIGHT/UNIT</th>
                <th style="padding: 12px 8px;">PRICE</th>
                <th style="padding: 12px 8px; border-top-right-radius: 8px; text-align: right;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${record.items.map((item, index) => `
                <tr style="background: #fff; border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 8px;">${index + 1}</td>
                  <td style="padding: 10px 8px; white-space: pre-line;">${item.itemName}</td>
                  <td style="padding: 10px 8px;">${item.quantity || '-'}</td>
                  <td style="padding: 10px 8px;">${item.price ? item.price.toFixed(2) : '-'}</td>
                  <td style="padding: 10px 8px; text-align: right;">${item.price ? (item.price * (item.quantity || 1)).toFixed(2) : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div style="display: flex; justify-content: space-between; padding: 0 24px; margin-top: 8px;">
          <div>
            <div style="font-size: 15px; font-weight: 600;">SUB TOTAL</div>
            <div style="font-size: 15px;">Discount</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 15px; font-weight: 600;">${record.items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0).toFixed(2)}</div>
            <div style="font-size: 15px;">0.00</div>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; padding: 0 24px; margin-top: 8px;">
          <div style="background: #7C3AED; color: #fff; border-radius: 24px; padding: 12px 32px; font-size: 20px; font-weight: 700;">TOTAL : Rs ${record.items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0).toFixed(2)}</div>
        </div>

        <!-- Notes -->
        <div style="padding: 24px; padding-bottom: 0;">
          <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">NOTES:</div>
          <div style="font-size: 13px;">Curtains - Premium Service Package (Pickup, delivery, cleaning, pressing, and installation)</div>
        </div>

        <!-- Thank You -->
        <div style="text-align: center; font-size: 18px; font-weight: 700; margin: 24px 0 8px 0; color: #222;">
          Thank you for trusting us!
        </div>

        <!-- Payment Methods -->
        <div style="padding: 0 24px; margin-bottom: 24px;">
          <div style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">Please make the payment using one of the following methods:</div>
          <div style="display: flex; border-top: 1px solid #bbb; border-bottom: 1px solid #bbb;">
            <div style="flex: 1; padding: 12px 8px; border-right: 1px solid #bbb;">
              <span style="color: #7C3AED; font-weight: 700;">1. Bank Transfer</span><br/>
              Account Name: [Your Account Name]<br/>
              Account Number: [Your Account Number]<br/>
              Bank Name: [Bank Name]<br/>
              Branch: [Branch Name, if needed]<br/>
              SWIFT/IFSC Code: [If applicable]
            </div>
            <div style="flex: 1; padding: 12px 8px;">
              <span style="color: #7C3AED; font-weight: 700;">2. Cash Payment</span><br/>
              You may also make your payment in cash.
            </div>
          </div>
          <div style="text-align: center; font-size: 15px; font-weight: 600; margin-top: 12px;">We truly appreciate your support!</div>
        </div>

      </div>

      <!-- Footer -->
      <div style="background: #7C3AED; color: #fff; padding: 16px 0 8px 0; text-align: center;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 32px; font-size: 15px; margin-bottom: 4px;">
          <span>www.cloudlaundry.lk</span>
          <span>•</span>
          <span>+94 76 180 4110</span>
          <span>•</span>
          <span>hello@cloudlaundry.lk</span>
        </div>
        <div style="font-size: 13px; color: #fff; margin-top: 4px;">- - Your Curtains Deserve The Best - -</div>
        <div style="font-size: 10px; color: #fff; margin-top: 2px;">CLOUD LAUNDRY.LK & CLEANERS (PVT) LTD.</div>
      </div>
    </div>
  `;

  const opt = {
    margin: 0,
    filename: `invoice_${record.invoiceNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(invoiceHTML).save();
};
