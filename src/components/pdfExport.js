import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = async (snags, reportName) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Colors
  const primaryColor = [0, 123, 255];
  const secondaryColor = [108, 117, 125];
  const lightGray = [240, 240, 240];

  // Helper function to add header and footer
  const addHeaderAndFooter = () => {
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 20, 'F');
    pdf.setTextColor(255);
    pdf.setFontSize(12);
    pdf.text('Snag It Report', margin, 14);
    
    pdf.setFillColor(...lightGray);
    pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(8);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 5);
    pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
  };

  // Add cover page
  addHeaderAndFooter();
  pdf.setFontSize(24);
  pdf.setTextColor(...primaryColor);
  pdf.text(reportName || 'Snag Report', pageWidth / 2, pageHeight / 2, { align: 'center' });
  pdf.setFontSize(12);
  pdf.setTextColor(...secondaryColor);
  pdf.text(`Total Snags: ${snags.length}`, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
  pdf.addPage();

  let yOffset = 30;

  for (const [index, snag] of snags.entries()) {
    const snagHeight = 80 + (snag.image ? 120 : 0);  // Estimated height for text + image + padding

    if (yOffset + snagHeight > pageHeight - 30) {
      pdf.addPage();
      yOffset = 30;
    }

    addHeaderAndFooter();

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
        const img = new Image();
        img.src = snag.image;
        await new Promise((resolve) => { img.onload = resolve; });
        const imgAspectRatio = img.width / img.height;
        const imgWidth = contentWidth;
        const imgHeight = imgWidth / imgAspectRatio;
        pdf.addImage(snag.image, 'JPEG', margin, yOffset, imgWidth, imgHeight, undefined, 'FAST');
        yOffset += imgHeight + 10;
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        pdf.text('Error loading image', margin, yOffset);
        yOffset += 10;
      }
    }

    yOffset += 20;  // Space between snags
  }

  // Add header and footer to all pages
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addHeaderAndFooter();
  }

  pdf.save(`${reportName || 'snag_report'}.pdf`);
};