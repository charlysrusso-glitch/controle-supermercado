"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Camera, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { NonConformity, NCPriority } from '@/lib/types';

interface NCManagementProps {
  ncs: NonConformity[];
  onCreateNC: (nc: Partial<NonConformity>) => void;
  onUpdateNC: (id: string, updates: Partial<NonConformity>) => void;
  onCloseNC: (id: string) => void;
}

export function NCManagement({ ncs, onCreateNC, onUpdateNC, onCloseNC }: NCManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedNC, setSelectedNC] = useState<NonConformity | null>(null);
  const [newNC, setNewNC] = useState({
    title: '',
    description: '',
    priority: 'medium' as NCPriority,
    responsibleId: '',
    dueDate: ''
  });

  const getPriorityColor = (priority: NCPriority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: NCPriority) => {
    switch (priority) {
      case 'critical': return 'Crítica';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Média';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberta';
      case 'in_progress': return 'Em Andamento';
      case 'closed': return 'Fechada';
      default: return 'Aberta';
    }
  };

  const handleCreateNC = () => {
    onCreateNC({
      ...newNC,
      dueDate: new Date(newNC.dueDate),
      createdAt: new Date(),
      status: 'open',
      evidencePhotos: []
    });
    setNewNC({
      title: '',
      description: '',
      priority: 'medium',
      responsibleId: '',
      dueDate: ''
    });
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Nova Não Conformidade</span>
            </CardTitle>
            <CardDescription>
              Preencha os dados da não conformidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newNC.title}
                onChange={(e) => setNewNC({ ...newNC, title: e.target.value })}
                placeholder="Título da não conformidade"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newNC.description}
                onChange={(e) => setNewNC({ ...newNC, description: e.target.value })}
                placeholder="Descreva detalhadamente a não conformidade encontrada"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={newNC.priority} onValueChange={(value: NCPriority) => setNewNC({ ...newNC, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dueDate">Prazo</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newNC.dueDate}
                  onChange={(e) => setNewNC({ ...newNC, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="responsible">Responsável</Label>
              <Select value={newNC.responsibleId} onValueChange={(value) => setNewNC({ ...newNC, responsibleId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Pedro Costa</SelectItem>
                  <SelectItem value="2">Ana Oliveira</SelectItem>
                  <SelectItem value="3">Carlos Lima</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button onClick={handleCreateNC} className="flex-1">
                Criar NC
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedNC) {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>NC #{selectedNC.id}</span>
                </CardTitle>
                <CardDescription>{selectedNC.title}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(selectedNC.priority)}>
                  {getPriorityLabel(selectedNC.priority)}
                </Badge>
                <Badge className={getStatusColor(selectedNC.status)}>
                  {getStatusLabel(selectedNC.status)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
              <p className="text-gray-600">{selectedNC.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Responsável</h4>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>RC</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Responsável</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Prazo</h4>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{selectedNC.dueDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {selectedNC.evidencePhotos.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Evidências</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedNC.evidencePhotos.map((photo, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">{photo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedNC.status === 'open' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="correctionDescription">Descrição da Correção</Label>
                  <Textarea
                    id="correctionDescription"
                    placeholder="Descreva as ações tomadas para corrigir a não conformidade"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>Foto da Correção</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-3">Anexe foto da correção</p>
                    <Button variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Capturar Foto
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              {selectedNC.status === 'open' && (
                <>
                  <Button 
                    onClick={() => onUpdateNC(selectedNC.id, { status: 'in_progress' })}
                    className="flex-1"
                  >
                    Iniciar Correção
                  </Button>
                  <Button 
                    onClick={() => onCloseNC(selectedNC.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Fechar NC
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setSelectedNC(null)}>
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Não Conformidades</h2>
          <p className="text-gray-600">Gerenciar NCs abertas e em andamento</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          Nova NC
        </Button>
      </div>

      <div className="space-y-4">
        {ncs.map((nc) => (
          <Card key={nc.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6" onClick={() => setSelectedNC(nc)}>
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(nc.priority)}`}></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      NC #{nc.id} - {nc.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{nc.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Responsável</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{nc.dueDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{nc.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(nc.priority)}>
                    {getPriorityLabel(nc.priority)}
                  </Badge>
                  <Badge className={getStatusColor(nc.status)}>
                    {getStatusLabel(nc.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {ncs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma NC encontrada
              </h3>
              <p className="text-gray-600">
                Não há não conformidades abertas no momento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}