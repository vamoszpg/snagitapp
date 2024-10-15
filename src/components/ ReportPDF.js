import React from 'react';
import styled from 'styled-components';

const PDFContainer = styled.div`
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 10px;
`;

const Subtitle = styled.h2`
  color: #7f8c8d;
  font-size: 18px;
  font-weight: normal;
`;

const ReportInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 14px;
  color: #34495e;
`;

const SnagItem = styled.div`
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  page-break-inside: avoid;
`;

const SnagTitle = styled.h3`
  color: #2980b9;
  margin-top: 0;
  margin-bottom: 10px;
`;

const SnagInfo = styled.p`
  margin: 5px 0;
`;

const SnagImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 4px;
`;

const ReportPDF = ({ report }) => (
  <PDFContainer>
    <Header>
      <Title>{report.name}</Title>
      <Subtitle>Snag Report</Subtitle>
    </Header>
    <ReportInfo>
      <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
      <span>Total Snags: {report.snags.length}</span>
    </ReportInfo>
    {report.snags.map((snag, index) => (
      <SnagItem key={snag.id}>
        <SnagTitle>{snag.title}</SnagTitle>
        <SnagInfo><strong>Category:</strong> {snag.category}</SnagInfo>
        <SnagInfo><strong>Description:</strong> {snag.description}</SnagInfo>
        <SnagInfo><strong>Date:</strong> {new Date(snag.date).toLocaleDateString()}</SnagInfo>
        {snag.image && <SnagImage src={snag.image} alt={snag.title} />}
      </SnagItem>
    ))}
  </PDFContainer>
);

export default ReportPDF;