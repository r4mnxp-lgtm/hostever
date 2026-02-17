import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Registrar as fontes
Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Poppins',
    fontSize: 9,
    padding: "40px 40px 60px 40px",
    color: '#333',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: 'grey',
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#ff6b35',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#ff6b35',
    borderBottom: '1px solid #ff6b35',
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    marginBottom: 8,
    lineHeight: 1.5,
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
  },
  col: {
    padding: 6,
    fontWeight: 600,
  },
  cell: {
    padding: 6,
  },
  colDesc: { flex: 3 },
  colDefault: { flex: 1.5 },
  bold: { fontWeight: 600 },
  acceptanceSection: {
    marginTop: 30,
    borderTop: '1px solid #ccc',
    paddingTop: 20,
  },
});

const ProposalDocument = ({ data }) => {
  if (!data) return null;

  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Image style={styles.logo} src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/5dbb7363250ea6cede2207646667a65d.png" />
        </View>

        <Text style={styles.title}>Proposta Comercial</Text>

        <Text style={styles.sectionTitle}>1. Solução</Text>
        <Text style={styles.text}>Após alinhamento com a equipe técnica e POC, foram enumerados alguns itens para atendimento das necessidades da empresa neste momento.</Text>
        <View style={styles.table}>
            <View style={styles.tableHeader}>
                <Text style={[styles.col, styles.colDefault]}>Cód. Fiscal</Text>
                <Text style={[styles.col, styles.colDesc]}>Descrição</Text>
                <Text style={[styles.col, styles.colDefault, {textAlign: 'right'}]}>Quantidade</Text>
            </View>
            {data.solutionItems.map(item => (
                <View key={item.id} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.colDefault]}>{item.code}</Text>
                    <Text style={[styles.cell, styles.colDesc]}>{item.desc}</Text>
                    <Text style={[styles.cell, styles.colDefault, {textAlign: 'right'}]}>{item.qty}</Text>
                </View>
            ))}
        </View>

        <Text style={styles.sectionTitle}>2. Condições Comerciais</Text>
        <Text style={styles.text}>Segue abaixo nossa proposta de valor para os itens selecionados:</Text>
        <View style={styles.table}>
            <View style={styles.tableHeader}>
                <Text style={[styles.col, styles.colDesc]}>Descrição</Text>
                <Text style={[styles.col, styles.colDefault]}>Quantidade</Text>
                <Text style={[styles.col, styles.colDefault]}>Valor Unitário</Text>
                <Text style={[styles.col, styles.colDefault, {textAlign: 'right'}]}>Valor Total</Text>
            </View>
            {data.commercialItems.map(item => (
                <View key={item.id} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.colDesc]}>{item.desc}</Text>
                    <Text style={[styles.cell, styles.colDefault]}>{item.qty}</Text>
                    <Text style={[styles.cell, styles.colDefault]}>R$ {item.unit}</Text>
                    <Text style={[styles.cell, styles.colDefault, {textAlign: 'right'}]}>R$ {item.total}</Text>
                </View>
            ))}
        </View>

        <Text style={styles.sectionTitle}>3. Termos Gerais</Text>
        <Text style={styles.text}><Text style={styles.bold}>Prazo Contratual:</Text> O prazo de vigência do contrato será de 12 (doze) meses, com renovação automática por períodos sucessivos e iguais.</Text>
        <Text style={styles.text}><Text style={styles.bold}>Validade da Proposta:</Text> O prazo de validade desta proposta é de 15 (quinze) dias.</Text>
        <Text style={styles.text}><Text style={styles.bold}>Confidencialidade:</Text> A AVYRA se obriga a manter o mais completo e absoluto sigilo sobre o projeto que será realizado e qualquer material ou informação a qual tenha acesso.</Text>
        
        <View style={styles.acceptanceSection}>
            <Text style={styles.sectionTitle}>4. Termo de Aceite</Text>
            <Text style={styles.text}>Autorizamos o fornecimento dos PRODUTOS / SERVIÇOS nos termos da Proposta Comercial, declarando pleno conhecimento e concordância quanto à descrição da solução.</Text>
            <Text style={styles.text}>Estamos "De Acordo" com os termos das Condições Gerais desta proposta.</Text>
            <Text style={[styles.text, {marginTop: 20}]}>São Paulo, {today}.</Text>

            <View style={{marginTop: 30, flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                    <Text style={styles.bold}>CONTRATANTE:</Text>
                    <Text>Cliente: {data.client.name}</Text>
                    <Text>CNPJ: {data.client.cnpj}</Text>
                    <Text>Responsável: {data.client.responsible}</Text>
                    <Text>E-mail: {data.client.email}</Text>
                </View>
                <View>
                    <Text style={styles.bold}>COMERCIAL:</Text>
                    <Text>Razão Social: AVYRA Cloud & Data Centers</Text>
                    <Text>CNPJ: 54.493.535/0001-92</Text>
                    <Text>Nome: Luan Alecsander</Text>
                    <Text>E-mail: luan.alecsander@avyra.com</Text>
                </View>
            </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
}

export default ProposalDocument;