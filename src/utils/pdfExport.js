import jsPDF from 'jspdf';
import 'jspdf-autotable';

console.log("pdfExport.js is loaded");

export const exportToPDF = async (report) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Colors
  const primaryColor = [0, 123, 255];  // #007bff
  const secondaryColor = [108, 117, 125];  // #6c757d
  const lightGray = [240, 240, 240];  // #f0f0f0

  // Helper function to add header and footer
  const addHeaderAndFooter = () => {
    // Header
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 20, 'F');
    pdf.setTextColor(255);
    pdf.setFontSize(12);
    pdf.text('Snag It Report', margin, 14);
    // Footer
    pdf.setFillColor(...lightGray);
    pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(8);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 5);
    pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
  };

  // Add first page
  addHeaderAndFooter();

  // Title
  pdf.setFontSize(24);
  pdf.setTextColor(...primaryColor);
  pdf.text(report.name, pageWidth / 2, 40, { align: 'center' });

  // Report info
  pdf.setFontSize(12);
  pdf.setTextColor(...secondaryColor);
  pdf.text(`Created: ${new Date(report.createdAt).toLocaleDateString()}`, margin, 55);
  pdf.text(`Total Snags: ${report.snags.length}`, pageWidth - margin, 55, { align: 'right' });

  let yOffset = 70;

  // Add snags
  for (const [index, snag] of report.snags.entries()) {
    const snagHeight = 10 + 30 + 100 + 30;  // Title + Table + Image + Padding

    // Check if there's enough space on the current page
    if (yOffset + snagHeight > pageHeight - 30) {
      pdf.addPage();
      addHeaderAndFooter();
      yOffset = 30;
    }

    // Snag title
    pdf.setFontSize(16);
    pdf.setTextColor(...primaryColor);
    pdf.text(`Snag ${index + 1}: ${snag.title || 'No Title'}`, margin, yOffset);
    yOffset += 10;

    // Snag details table
    pdf.autoTable({
      startY: yOffset,
      head: [['Room', 'Description', 'Date']],
      body: [
        [
          snag.category || 'Not specified',
          snag.description || 'No description',
          snag.date ? new Date(snag.date).toLocaleDateString() : 'Not specified'
        ]
      ],
      headStyles: { fillColor: primaryColor, textColor: 255 },
      alternateRowStyles: { fillColor: lightGray },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth
    });

    yOffset = pdf.lastAutoTable.finalY + 10;

    // Add image if available
    if (snag.image) {
      try {
        const imgData = await fetchImageAsBase64(snag.image);
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = contentWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        pdf.addImage(imgData, 'JPEG', margin, yOffset, imgWidth, imgHeight, undefined, 'FAST');
        yOffset += imgHeight + 10;
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        pdf.text('Error loading image', margin, yOffset);
        yOffset += 10;
      }
    }

    // Add some space between snags
    yOffset += 20;
  }

  // Add header and footer to all pages
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addHeaderAndFooter();
  }

  pdf.save(`${report.name}_report.pdf`);
};

const fetchImageAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
