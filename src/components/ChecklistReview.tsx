"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  X, 
  Camera, 
  AlertTriangle,
  FileText,
  Clock,
  User
} from 'lucide-react';
import { ChecklistItem } from '@/lib/types';

interface ChecklistReviewProps {
  checklist: {
    id: string;
    employee: string;
    sector: string;
    date: string;
    items: ChecklistItem[];
    responses: any[];
  };
  onApprove: () => void;
  onReject: () => void;
  onCreateNC: (itemId: string) => void;
  onBack: () => void;
}

export function ChecklistReview({ checklist, onApprove, onReject, onCreateNC, onBack }: ChecklistReviewProps) {
  const [comments, setComments] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Voltar
            </Button>
            <div className="text-center">
              <h2 className="font-semibold text-gray-900">Revisão de Checklist</h2>
              <p className="text-sm text-gray-600">{checklist.employee} - {checklist.sector}</p>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Informações do Checklist */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {checklist.employee.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{checklist.employee}</CardTitle>
                  <CardDescription>{checklist.sector} - {checklist.date}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                Pendente
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Itens do Checklist */}
        <div className="space-y-4 mb-6">
          {checklist.items.map((item, index) => {
            const response = checklist.responses.find(r => r.itemId === item.id);
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <Card key={item.id} className={`${isSelected ? 'ring-2 ring-red-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-2">
                          {item.isCritical && (
                            <Badge variant="destructive" className="text-xs">Crítico</Badge>
                          )}
                          {item.requiresPhoto && (
                            <Badge variant="secondary" className="text-xs">
                              <Camera className="w-3 h-3 mr-1" />
                              Foto
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Resposta */}
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        response?.response === 'yes' ? 'bg-green-100 text-green-800' :
                        response?.response === 'no' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {response?.response === 'yes' && <CheckCircle className="w-4 h-4 mr-1" />}
                        {response?.response === 'no' && <X className="w-4 h-4 mr-1" />}
                        {response?.response === 'yes' ? 'Sim' : 
                         response?.response === 'no' ? 'Não' : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Foto */}
                  {response?.photo && (
                    <div className="mb-4">
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Foto anexada: {response.photo}</p>
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  {response?.observation && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Observações:
                      </label>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {response.observation}
                      </p>
                    </div>
                  )}

                  {/* Ações para itens críticos reprovados */}
                  {item.isCritical && response?.response === 'no' && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">
                          Item crítico reprovado
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => handleItemSelect(item.id)}
                        >
                          {isSelected ? 'Selecionado' : 'Selecionar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onCreateNC(item.id)}
                        >
                          Abrir NC
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comentários do Gerente */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Comentários da Revisão</CardTitle>
            <CardDescription>
              Adicione observações sobre este checklist (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Digite seus comentários sobre a execução deste checklist..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1 bg-green-500 hover:bg-green-600"
            size="lg"
            onClick={onApprove}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Aprovar Checklist
          </Button>
          
          <Button
            className="flex-1 bg-red-500 hover:bg-red-600"
            size="lg"
            onClick={onReject}
          >
            <X className="w-5 h-5 mr-2" />
            Reprovar Checklist
          </Button>
        </div>

        {selectedItems.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-800">
                {selectedItems.length} item(s) selecionado(s) para NC
              </span>
            </div>
            <p className="text-sm text-red-600">
              Itens críticos reprovados serão convertidos em Não Conformidades automaticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}