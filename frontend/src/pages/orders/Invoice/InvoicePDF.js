import html2pdf from "html2pdf.js";
import dayjs from "dayjs";
import logo from "../../../images/logo.png";

import laundry from "../../../images/laundry.png";
import Curtains from "../../../images/curtins.png";
import Sofa from "../../../images/sofa.png";
import House from "../../../images/house.png";

export const generateInvoicePDF = (record) => {
  const invoiceHTML = `
    <div style="font-family: 'Poppins', sans-serif; width: 794px; height: 1122px; margin: 0 auto; background: #fff; display: flex; flex-direction: column;">

      <!-- Main Content -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 24px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="flex: 1; position: relative;">
            <img src="${logo}" alt="Logo" style="height: 150px; object-fit: contain; position: absolute; top: 0; left: 0;" />
          </div>

          <div style="text-align: right;">
            <h1 style="color: #5628C3; margin: 0; font-size: 24px; font-weight: 700;">CLOUD LAUNDRY.LK</h1>
            <p style="margin: 0; font-size: 13px;">504 weliwita Rd, Malabe</p>
            <p style="margin: 0; font-size: 13px;">IN: ${record.invoiceNumber}</p>
            <p style="margin: 0; font-size: 13px;">Date: ${dayjs().format("DD MMMM YYYY, hh:mm A")}</p>
          </div>
        </div>

        <!-- Watermark -->
        <img src="${logo}" style="position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); opacity: 0.08; z-index: 0; width: 70%; pointer-events: none;" />

        <!-- Invoice To & Illustration -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 16px;">
          <div>
            <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">INVOICE TO</div>
            <div style="font-size: 14px; font-weight: 600; text-transform: uppercase;">${record.customerName}</div>
            <div style="font-size: 13px;">${record.customerID || ""}</div>
            <div style="font-size: 13px;">${record.customerPhone}</div>
            <div style="font-size: 13px;">${record.Addressline1}</div>
            <div style="font-size: 13px;">${record.Addressline2}</div>
          </div>
            ${(() => {
              let serviceImage = null;
              switch (record.selectedService) {
                case "Curtains Cleaning":
                  serviceImage = Curtains;
                  break;
                case "Sofa, Carpet & Interior Cleaning":
                  serviceImage = Sofa;
                  break;
                case "Domestic Cleaning":
                  serviceImage = House;
                  break;
                case "Laundry":
                default:
                  serviceImage = laundry;
              }
              return `<img src="${serviceImage}" alt="${record.selectedService}" style="height: 150px; margin-left: 24px;" />`;
            })()}
        </div>

        <!-- Table -->
        <div style="margin-top: 24px;">
          <table style="width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px;">
            <thead>
              <tr style="background: #5628C3; color: #fff;">
                <th style="padding: 12px 8px; border-top-left-radius: 8px;">#</th>
                <th style="padding: 12px 8px;">SERVICE DESCRIPTION</th>
                <th style="padding: 12px 8px;">WEIGHT/UNIT</th>
                <th style="padding: 12px 8px;">PRICE</th>
                <th style="padding: 12px 8px; border-top-right-radius: 8px; text-align: right;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${record.items
                .map(
                  (item, index) => `
                <tr style="background: #fff; border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 8px;">${index + 1}</td>
                  <td style="padding: 10px 8px; white-space: pre-line;">${item.itemName}</td>
                  <td style="padding: 10px 8px;">${item.quantity || "-"}</td>
                  <td style="padding: 10px 8px;">${item.price ? item.price.toFixed(2) : "-"}</td>
                  <td style="padding: 10px 8px; text-align: right;">${item.price ? (item.price * (item.quantity || 1)).toFixed(2) : "-"}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div style="display: flex; justify-content: space-between; margin-top: 16px;">
          <div>
            <div style="font-size: 15px; font-weight: 600;">SUB TOTAL</div>
            <div style="font-size: 15px;">Discount</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 15px; font-weight: 600;">${record.items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0).toFixed(2)}</div>
            <div style="font-size: 15px;">-${Number(record.pickupDiscount).toFixed(2)}</div>
          </div>
        </div>

        <!-- Total Box -->
        <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
          <div style="background: #5628C3; color: #fff; border-radius: 24px; padding: 12px 32px; font-size: 20px; font-weight: 700;">
            TOTAL : Rs ${(record.items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0) - Number(record.pickupDiscount)).toFixed(2)}
          </div>
        </div>

        <!-- Notes -->
        <div style="margin-top: 16px;">
          <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">NOTES:</div>
          <div style="font-size: 13px;">${record.note}</div>
        </div>

        <!-- Thank You -->
        <div style="text-align: center; font-size: 18px; font-weight: 700; margin: 24px 0 8px 0; color: #222;">
          Thank you for trusting us!
        </div>

        <!-- Payment Methods -->
        <div>
          <div style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">Please make the payment using one of the following methods:</div>
          <div style="display: flex; border-top: 1px solid #bbb; border-bottom: 1px solid #bbb;">
            <div style="flex: 1; padding: 12px 8px; border-right: 1px solid #bbb;">
              <span style="color: #5628C3; font-weight: 700;">1. Bank Transfer</span><br/>
              Account Name: CLOUD LAUNDRY.LK AND CLEANERS (PVT) LTD.<br/>
              Account Number: 1000906392<br/>
              Bank Name: Commercial Bank  <br/>
              Branch:Malabe<br/>
              
            </div>
            <div style="flex: 1; padding: 12px 8px;">
              <span style="color: #5628C3; font-weight: 700;">2. Cash Payment</span><br/>
              You may also make your payment in cash.
            </div>
          </div>
          <div style="text-align: center; font-size: 15px; font-weight: 600; margin-top: 12px;">We truly appreciate your support!</div>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #5628C3; color: #fff; padding: 16px 0 8px 0; text-align: center;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 32px; font-size: 15px; margin-bottom: 4px;">
          <span>www.cloudlaundry.lk</span>
          <span>•</span>
          <span>+94 76 180 4110</span>
          <span>•</span>
          <span>hello@cloudlaundry.lk</span>
        </div>
        <div style="font-size: 13px;">- - Your Curtains Deserve The Best - -</div>
        <div style="font-size: 10px;">CLOUD LAUNDRY.LK & CLEANERS (PVT) LTD.</div>
      </div>
    </div>
  `;

  const opt = {
    margin: 0,
    filename: `invoice_${record.invoiceNumber}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "px", format: [794, 1122], orientation: "portrait" },
  };

  html2pdf().set(opt).from(invoiceHTML).save();
};
