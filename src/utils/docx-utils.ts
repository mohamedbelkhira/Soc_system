// src/utils/docx-utils.ts
import { Document, Paragraph, Table, TableCell, TableRow, BorderStyle, HeadingLevel, TextRun, AlignmentType } from 'docx';
import { SecurityBulletinData } from '../types/SecurityBulletin';
import { saveAs } from 'file-saver';

/**
 * Creates a formatted table cell for DOCX
 * @param text Cell text content
 * @param isHeader Whether this is a header cell
 */
export function createTableCell(text: string, isHeader = false): TableCell {
  return new TableCell({
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
    shading: isHeader ? { color: "D3D3D3" } : undefined,
    children: [new Paragraph({ text, bold: isHeader })],
    width: { size: isHeader ? 30 : 70, type: "percentage" },
  });
}

/**
 * Creates a section with heading and content
 * @param heading Section heading
 * @param content Section content
 */
export function createSection(heading: string, content: string): Paragraph[] {
  // Parse markdown-like content for bold text with ** markers
  const contentParagraphs = content.split('\n').map(line => {
    if (line.trim() === '') return new Paragraph('');
    
    // Process line for bold sections marked with **
    const textRuns: TextRun[] = [];
    let currentText = '';
    let inBold = false;
    
    for (let i = 0; i < line.length; i++) {
      if (i < line.length - 1 && line.substr(i, 2) === '**') {
        // Add accumulated text with appropriate style
        if (currentText) {
          textRuns.push(new TextRun({ text: currentText, bold: inBold }));
          currentText = '';
        }
        // Toggle bold state
        inBold = !inBold;
        i++; // Skip second asterisk
      } else if (line[i] === '-' && i === 0) {
        // Handle bullet points
        if (currentText) {
          textRuns.push(new TextRun({ text: currentText, bold: inBold }));
        }
        textRuns.push(new TextRun({ text: '• ', bold: true }));
        currentText = '';
      } else {
        currentText += line[i];
      }
    }
    
    // Add any remaining text
    if (currentText) {
      textRuns.push(new TextRun({ text: currentText, bold: inBold }));
    }
    
    return new Paragraph({ children: textRuns });
  });

  return [
    new Paragraph({ text: heading, heading: HeadingLevel.HEADING_2, bold: true }),
    ...contentParagraphs
  ];
}

/**
 * Creates and returns a DOCX document from the security bulletin data
 * @param data Security bulletin data
 */
export async function createBulletinDocument(data: SecurityBulletinData): Promise<Document> {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "Bulletin d'alerte",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER
          }),
          
          // Header table
          new Table({
            width: { size: 100, type: "percentage" },
            rows: [
              new TableRow({
                children: [
                  createTableCell("Référence", true),
                  createTableCell(data.reference),
                  createTableCell("Version alerte", true),
                  createTableCell(data.version),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell("Date", true),
                  createTableCell(data.date),
                  createTableCell("Date alerte", true),
                  createTableCell(data.alertDate),
                ],
              }),
            ],
          }),
          
          // Spacing
          new Paragraph(""),
          
          // Main info table
          new Table({
            width: { size: 100, type: "percentage" },
            rows: [
              new TableRow({
                children: [
                  createTableCell("Titre", true),
                  createTableCell(data.title),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell("Source(s)", true),
                  createTableCell(data.source),
                ],
              }),
              new TableRow({
                children: [
                  createTableCell("Produits concernés", true),
                  createTableCell(data.products),
                ],
              }),
            ],
          }),
          
          // Spacing
          new Paragraph(""),
          
          // Criticality section
          new Paragraph({ 
            text: "Criticité de l'événement : ",
            bold: true
          }),
          
          new Paragraph({ 
            text: data.criticality,
            bold: true,
            color: getCriticalityColor(data.criticality)
          }),
          
          // Spacing
          new Paragraph(""),
          
          // Content sections
          ...createSection("Résumé :", data.summary),
          ...createSection("Risque(s) et impact(s) :", data.risks),
          ...createSection("Produits concernés :", data.affectedProducts),
          ...createSection("Conditions d'Exploitation", data.exploitationConditions),
          ...createSection("Détection", data.detection),
          ...createSection("Actions à entreprendre :", data.actions),
          ...createSection("Documentation :", data.documentation),
        ],
      },
    ],
  });
}

/**
 * Get text color based on criticality level
 */
function getCriticalityColor(criticality: string): string {
  switch (criticality) {
    case 'Critique': return 'FF0000'; // Red
    case 'Haut': return 'FFA500';     // Orange
    case 'Moyen': return 'FFCC00';    // Yellow
    case 'Faible': return '008000';   // Green
    default: return '000000';         // Black
  }
}

/**
 * Export security bulletin data to DOCX file
 * @param data Security bulletin data
 */
export async function exportToDocx(data: SecurityBulletinData): Promise<void> {
  try {
    const { Packer } = await import('docx');
    const doc = await createBulletinDocument(data);
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `bulletin-alerte-${data.reference}.docx`);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting document:', error);
    return Promise.reject(error);
  }
}