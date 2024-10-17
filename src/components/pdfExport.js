import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = async (report) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Colors
  const primaryColor = [44, 62, 80]; // #2c3e50
  const secondaryColor = [127, 140, 141]; // #7f8c8d
  const lightGray = [236, 240, 241]; // #ecf0f1

  // Helper function to add header and footer
  const addHeaderAndFooter = () => {
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 20, 'F');
    pdf.setTextColor(255);
    pdf.setFontSize(12);
    pdf.text('Snag Report', margin, 14);
    
    pdf.setFillColor(...lightGray);
    pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(8);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 5);
    pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
  };

  // Add cover page
  addHeaderAndFooter();
  pdf.setFontSize(28);
  pdf.setTextColor(...primaryColor);
  pdf.text(report.name, pageWidth / 2, 50, { align: 'center' });
  pdf.setFontSize(18);
  pdf.setTextColor(...secondaryColor);
  pdf.text('Snag Report', pageWidth / 2, 65, { align: 'center' });

  pdf.setFontSize(12);
  pdf.text(`Created: ${new Date(report.createdAt).toLocaleDateString()}`, margin, 90);
  pdf.text(`Total Snags: ${report.snags.length}`, margin, 100);

  pdf.addPage();

  let yOffset = 30;

  // Group snags by room
  const groupedSnags = report.snags.reduce((acc, snag) => {
    if (!acc[snag.category]) {
      acc[snag.category] = [];
    }
    acc[snag.category].push(snag);
    return acc;
  }, {});

  for (const [room, snags] of Object.entries(groupedSnags)) {
    if (yOffset > pageHeight - 60) {
      pdf.addPage();
      yOffset = 30;
    }

    addHeaderAndFooter();

    // Room title
    pdf.setFontSize(16);
    pdf.setTextColor(...primaryColor);
    pdf.text(room, margin, yOffset);
    yOffset += 10;

    for (const snag of snags) {
      const snagHeight = 60 + (snag.image ? 120 : 0);  // Estimated height for text + image + padding

      if (yOffset + snagHeight > pageHeight - 30) {
        pdf.addPage();
        yOffset = 30;
        addHeaderAndFooter();
      }

      // Snag title
      pdf.setFontSize(14);
      pdf.setTextColor(...primaryColor);
      pdf.text(snag.title || 'No Title', margin, yOffset);
      yOffset += 10;

      // Snag details
      pdf.setFontSize(10);
      pdf.setTextColor(...secondaryColor);
      pdf.text(`Description: ${snag.description || 'No Description'}`, margin, yOffset);
      yOffset += 7;
      pdf.text(`Date: ${snag.date ? new Date(snag.date).toLocaleDateString() : 'Not specified'}`, margin, yOffset);
      yOffset += 10;

      // Add image if available
      if (snag.image) {
        try {
          const img = new Image();
          img.src = snag.image;
          await new Promise((resolve) => { img.onload = resolve; });
          const imgAspectRatio = img.width / img.height;
          const imgWidth = Math.min(contentWidth, 150);
          const imgHeight = imgWidth / imgAspectRatio;
          pdf.addImage(snag.image, 'JPEG', margin, yOffset, imgWidth, imgHeight, undefined, 'FAST');
          yOffset += imgHeight + 10;
        } catch (error) {
          console.error('Error adding image to PDF:', error);
          pdf.text('Error loading image', margin, yOffset);
          yOffset += 10;
        }
      }

      yOffset += 15;  // Space between snags
    }

    yOffset += 20;  // Space between rooms
  }

  // Add header and footer to all pages
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addHeaderAndFooter();
  }

  pdf.save(`${report.name}.pdf`);
};
