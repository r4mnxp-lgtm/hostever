import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileWarning } from 'lucide-react';

const ProposalView = () => {
    const { id } = useParams();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate fetching from "backend" (localStorage)
        const fetchProposal = () => {
            try {
                const savedProposals = localStorage.getItem('avyra-proposals');
                if (savedProposals) {
                    const parsed = JSON.parse(savedProposals);
                    // Match by publicLinkId OR internal ID for flexibility in demo
                    const found = parsed.find(p => p.publicLinkId === id || p.id.toString() === id);
                    
                    if (found) {
                        if (found.isPublic) {
                            setProposal(found);
                        } else {
                            setError('Esta proposta não está mais disponível publicamente.');
                        }
                    } else {
                        setError('Proposta não encontrada.');
                    }
                } else {
                    setError('Proposta não encontrada.');
                }
            } catch (err) {
                setError('Erro ao carregar proposta.');
            } finally {
                setLoading(false);
            }
        };

        fetchProposal();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#84cc16]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                    <FileWarning className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Indisponível</h1>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (!proposal) return null;

    // Calculate Totals
    const totalMonthly = proposal.commercialItems.reduce((acc, item) => {
        // Simple parse for demo (assuming Brazilian format '1.000,00' or '1000')
        const price = parseFloat(item.total.replace(/\./g, '').replace(',', '.'));
        return acc + (isNaN(price) ? 0 : price);
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <Helmet>
                <title>Proposta Comercial - {proposal.client.name} | HostEver</title>
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-[#0f172a] text-white p-8 sm:p-12 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#84cc16]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                             <img 
                                src="https://horizons-cdn.hostinger.com/a92ad8e5-9427-4320-be8e-1c50dbf11a99/0f842682e9af7d102370ce4397fd1a2b.png" 
                                alt="HostEver Logo" 
                                className="h-8 mb-6 brightness-0 invert" 
                            />
                            <h1 className="text-3xl font-bold font-sora">Proposta Comercial</h1>
                            <p className="text-gray-400 mt-2">Preparada especialmente para <span className="text-white font-bold">{proposal.client.name}</span></p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-400">Data de Emissão</div>
                            <div className="font-bold">{proposal.createdAt}</div>
                             <div className="text-sm text-gray-400 mt-2">Validade da Proposta</div>
                            <div className="font-bold text-[#84cc16] text-lg">{proposal.validityDays || 15} Dias</div>
                        </div>
                     </div>
                </div>

                <div className="p-8 sm:p-12 space-y-12">
                    
                    {/* Solution Scope */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center mr-3 text-sm">01</span>
                            Escopo da Solução
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-900 font-bold">
                                    <tr>
                                        <th className="p-4 rounded-l-lg">Descrição</th>
                                        <th className="p-4 rounded-r-lg text-right">Qtd</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {proposal.solutionItems.map((item, i) => (
                                        <tr key={i}>
                                            <td className="p-4">{item.desc}</td>
                                            <td className="p-4 text-right font-bold">{item.qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Investment */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6 flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center mr-3 text-sm">02</span>
                            Investimento Mensal
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-900 font-bold">
                                    <tr>
                                        <th className="p-4 rounded-l-lg w-1/2">Produto</th>
                                        <th className="p-4 text-center">Quantidade</th>
                                        <th className="p-4 rounded-r-lg text-right">Valor Unitário</th>
                                        <th className="p-4 rounded-r-lg text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {proposal.commercialItems.map((item, i) => (
                                        <tr key={i}>
                                            <td className="p-4 font-bold text-gray-900">{item.desc}</td>
                                            <td className="p-4 text-center">{item.qty}</td>
                                            <td className="p-4 text-right">R$ {item.unit}</td>
                                            <td className="p-4 text-right font-bold text-gray-900">R$ {item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-[#84cc16]/10">
                                        <td colSpan="3" className="p-4 text-right font-bold text-gray-900 text-lg uppercase tracking-wide">Valor da Proposta Final:</td>
                                        <td className="p-4 text-right font-bold text-[#84cc16] text-xl">
                                            R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        {proposal.activationFee?.unit && (
                            <div className="mt-6 flex justify-end">
                                <div className="bg-gray-50 rounded-lg p-4 inline-block text-right">
                                    <span className="text-sm text-gray-500 mr-4">Taxa de Ativação (Setup):</span>
                                    <span className="font-bold text-gray-900">R$ {proposal.activationFee.unit}</span>
                                </div>
                            </div>
                        )}
                    </section>
                    
                    {/* CTA Actions */}
                    <div className="bg-gray-50 rounded-xl p-8 text-center mt-12">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Pronto para começar?</h3>
                        <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                           Entre em contato com seu consultor comercial para formalizar a contratação.
                        </p>
                    </div>
                </div>
                
                <div className="bg-gray-100 p-6 text-center text-xs text-gray-400">
                    <p>HostEver Data Centers • CNPJ 54.493.535/0001-92</p>
                </div>
            </motion.div>
        </div>
    );
};

export default ProposalView;