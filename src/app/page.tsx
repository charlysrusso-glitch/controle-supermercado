"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  ClipboardList, 
  TrendingUp,
  Camera,
  FileText,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  BarChart3
} from 'lucide-react';
import { SECTORS, MOCK_USERS, getChecklistItemsBySector } from '@/lib/data';
import { User, UserRole, NonConformity } from '@/lib/types';
import { ChecklistReview } from '@/components/ChecklistReview';
import { NCManagement } from '@/components/NCManagement';
import { Reports } from '@/components/Reports';

// Componente de Login
function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Controle Operacional</CardTitle>
          <CardDescription>Sistema de Checklists - Supermercado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">Selecione seu perfil para continuar:</div>
          {MOCK_USERS.map((user) => (
            <Button
              key={user.id}
              variant="outline"
              className="w-full justify-start h-auto p-4"
              onClick={() => onLogin(user)}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-orange-500 text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500 capitalize">
                    {user.role === 'admin' ? 'Administrador' : 
                     user.role === 'manager' ? 'Gerente' : 'Funcionário'} - {user.sector}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Header
function Header({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Controle Operacional</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Sistema de Checklists</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-orange-500 text-white text-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                {showMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role === 'admin' ? 'Administrador' : 
                       user.role === 'manager' ? 'Gerente' : 'Funcionário'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-4 py-2 text-sm"
                    onClick={() => setShowMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Dashboard para Funcionários
function EmployeeDashboard({ user }: { user: User }) {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [currentChecklist, setCurrentChecklist] = useState<any>(null);

  const userSector = SECTORS.find(s => s.id === user.sector);
  const checklistItems = user.sector ? getChecklistItemsBySector(user.sector) : [];

  if (selectedSector && currentChecklist) {
    return <ChecklistExecution 
      sector={selectedSector} 
      onBack={() => {
        setSelectedSector(null);
        setCurrentChecklist(null);
      }}
      user={user}
    />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Minhas Tarefas</h2>
        <p className="text-gray-600">Setor: {userSector?.name} - Turno: {user.shift}</p>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tarefas Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{checklistItems.length}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{checklistItems.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-red-600">{checklistItems.filter(i => i.isCritical).length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checklist do Setor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${userSector?.color}`}></div>
            <span>Checklist - {userSector?.name}</span>
          </CardTitle>
          <CardDescription>
            {checklistItems.length} itens para verificação hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checklistItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
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
                <Button 
                  size="sm"
                  onClick={() => {
                    setSelectedSector(user.sector);
                    setCurrentChecklist({ items: checklistItems });
                  }}
                >
                  Executar
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
              size="lg"
              onClick={() => {
                setSelectedSector(user.sector);
                setCurrentChecklist({ items: checklistItems });
              }}
            >
              <ClipboardList className="w-5 h-5 mr-2" />
              Iniciar Checklist Completo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Execução do Checklist
function ChecklistExecution({ sector, onBack, user }: { sector: string; onBack: () => void; user: User }) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [showSignature, setShowSignature] = useState(false);

  const sectorData = SECTORS.find(s => s.id === sector);
  const items = getChecklistItemsBySector(sector);
  const currentItem = items[currentItemIndex];
  const progress = ((currentItemIndex + 1) / items.length) * 100;

  const handleResponse = (response: 'yes' | 'no' | 'na') => {
    setResponses({
      ...responses,
      [currentItem.id]: { ...responses[currentItem.id], response }
    });
  };

  const handleNext = () => {
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      setShowSignature(true);
    }
  };

  const handleFinish = () => {
    // Simular assinatura digital
    const timestamp = new Date().toLocaleString('pt-BR');
    alert(`Checklist concluído com sucesso!\n\nAssinatura Digital: ${user.name}\nData/Hora: ${timestamp}\n\nEnviado para aprovação do gerente.`);
    onBack();
  };

  const canProceed = responses[currentItem?.id]?.response && 
    (!currentItem?.requiresPhoto || responses[currentItem?.id]?.photo);

  if (showSignature) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle>Checklist Concluído!</CardTitle>
            <CardDescription>
              Confirme sua assinatura digital para finalizar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Funcionário:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Setor:</span>
                  <span className="font-medium">{sectorData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data/Hora:</span>
                  <span className="font-medium">{new Date().toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Itens:</span>
                  <span className="font-medium">{items.length} verificados</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleFinish} className="flex-1 bg-gradient-to-r from-green-500 to-orange-500">
                Assinar e Enviar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Checklist */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Voltar
            </Button>
            <div className="text-center">
              <h2 className="font-semibold text-gray-900">{sectorData?.name}</h2>
              <p className="text-sm text-gray-600">Item {currentItemIndex + 1} de {items.length}</p>
            </div>
            <div className="w-16"></div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Conteúdo do Item */}
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              {currentItem?.isCritical && (
                <Badge variant="destructive">Crítico</Badge>
              )}
              {currentItem?.requiresPhoto && (
                <Badge variant="secondary">
                  <Camera className="w-3 h-3 mr-1" />
                  Foto Obrigatória
                </Badge>
              )}
            </div>
            <CardTitle>{currentItem?.title}</CardTitle>
            <CardDescription>{currentItem?.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Botões de Resposta */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Situação encontrada:
              </label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={responses[currentItem?.id]?.response === 'yes' ? 'default' : 'outline'}
                  className={responses[currentItem?.id]?.response === 'yes' ? 'bg-green-500 hover:bg-green-600' : ''}
                  onClick={() => handleResponse('yes')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sim
                </Button>
                <Button
                  variant={responses[currentItem?.id]?.response === 'no' ? 'default' : 'outline'}
                  className={responses[currentItem?.id]?.response === 'no' ? 'bg-red-500 hover:bg-red-600' : ''}
                  onClick={() => handleResponse('no')}
                >
                  <X className="w-4 h-4 mr-2" />
                  Não
                </Button>
                <Button
                  variant={responses[currentItem?.id]?.response === 'na' ? 'default' : 'outline'}
                  className={responses[currentItem?.id]?.response === 'na' ? 'bg-gray-500 hover:bg-gray-600' : ''}
                  onClick={() => handleResponse('na')}
                >
                  N/A
                </Button>
              </div>
            </div>

            {/* Foto */}
            {currentItem?.requiresPhoto && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Evidência fotográfica:
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">Tire uma foto como evidência</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Simular captura de foto
                      setResponses({
                        ...responses,
                        [currentItem.id]: { 
                          ...responses[currentItem.id], 
                          photo: `foto_${currentItem.id}_${Date.now()}.jpg` 
                        }
                      });
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capturar Foto
                  </Button>
                  {responses[currentItem?.id]?.photo && (
                    <div className="mt-3 text-sm text-green-600">
                      ✓ Foto capturada: {responses[currentItem.id].photo}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Observações */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Observações (opcional):
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
                placeholder="Adicione observações sobre este item..."
                value={responses[currentItem?.id]?.observation || ''}
                onChange={(e) => setResponses({
                  ...responses,
                  [currentItem.id]: { 
                    ...responses[currentItem.id], 
                    observation: e.target.value 
                  }
                })}
              />
            </div>

            {/* Botão Continuar */}
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
              size="lg"
              disabled={!canProceed}
              onClick={handleNext}
            >
              {currentItemIndex === items.length - 1 ? 'Finalizar Checklist' : 'Próximo Item'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dashboard para Gerentes
function ManagerDashboard({ user }: { user: User }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'review' | 'nc'>('dashboard');
  const [mockNCs, setMockNCs] = useState<NonConformity[]>([]);

  const mockChecklists = [
    {
      id: '1',
      employee: 'Pedro Costa',
      sector: 'Padaria',
      date: new Date().toLocaleDateString('pt-BR'),
      items: getChecklistItemsBySector('padaria'),
      responses: getChecklistItemsBySector('padaria').map(item => ({
        itemId: item.id,
        response: Math.random() > 0.8 ? 'no' : 'yes',
        photo: item.requiresPhoto ? `foto_${item.id}.jpg` : undefined,
        observation: Math.random() > 0.7 ? 'Observação do funcionário' : undefined
      }))
    }
  ];

  if (currentView === 'review') {
    return (
      <ChecklistReview
        checklist={mockChecklists[0]}
        onApprove={() => {
          alert('Checklist aprovado com sucesso!');
          setCurrentView('dashboard');
        }}
        onReject={() => {
          alert('Checklist reprovado. Funcionário será notificado.');
          setCurrentView('dashboard');
        }}
        onCreateNC={(itemId) => {
          alert(`NC criada para o item ${itemId}`);
          setCurrentView('nc');
        }}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'nc') {
    return (
      <NCManagement
        ncs={mockNCs}
        onCreateNC={(nc) => {
          const newNC = {
            ...nc,
            id: Date.now().toString(),
            checklistId: '1',
            itemId: 'item_1',
            managerId: user.id,
            status: 'open' as const,
            evidencePhotos: []
          } as NonConformity;
          setMockNCs([...mockNCs, newNC]);
        }}
        onUpdateNC={(id, updates) => {
          setMockNCs(mockNCs.map(nc => nc.id === id ? { ...nc, ...updates } : nc));
        }}
        onCloseNC={(id) => {
          setMockNCs(mockNCs.map(nc => nc.id === id ? { ...nc, status: 'closed' as const, closedAt: new Date() } : nc));
        }}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Painel Gerencial</h2>
        <p className="text-gray-600">Aprovações e acompanhamento de tarefas</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
          <TabsTrigger value="rejected">Reprovados</TabsTrigger>
          <TabsTrigger value="nc">Não Conformidades</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Checklists Pendentes de Aprovação</CardTitle>
              <CardDescription>3 checklists aguardando sua análise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockChecklists.map((checklist) => (
                  <div key={checklist.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>PC</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{checklist.employee} - {checklist.sector}</h4>
                        <p className="text-sm text-gray-600">Enviado há 2 horas</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setCurrentView('review')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Revisar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Checklists Aprovados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Nenhum checklist aprovado hoje.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Checklists Reprovados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Nenhum checklist reprovado hoje.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nc">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Não Conformidades Abertas</CardTitle>
                <Button onClick={() => setCurrentView('nc')}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Gerenciar NCs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {mockNCs.length === 0 ? 'Nenhuma não conformidade aberta.' : `${mockNCs.length} NCs abertas`}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Dashboard para Administradores
function AdminDashboard({ user }: { user: User }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'reports'>('dashboard');

  const mockStats = {
    totalChecklists: 156,
    completedToday: 24,
    pendingApproval: 3,
    openNCs: 8,
    conformityRate: 94,
    sectorStats: SECTORS.map(sector => ({
      sector: sector.id,
      conformityRate: Math.floor(Math.random() * 20 + 80),
      totalTasks: Math.floor(Math.random() * 50 + 20),
      completedTasks: Math.floor(Math.random() * 40 + 15)
    }))
  };

  if (currentView === 'reports') {
    return <Reports stats={mockStats} />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Painel Administrativo</h2>
          <p className="text-gray-600">Visão geral do sistema e relatórios</p>
        </div>
        <Button onClick={() => setCurrentView('reports')}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Ver Relatórios
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Checklists</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalChecklists}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conformidade</p>
                <p className="text-2xl font-bold text-green-600">{mockStats.conformityRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NCs Abertas</p>
                <p className="text-2xl font-bold text-red-600">{mockStats.openNCs}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Funcionários</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Conformidade por Setor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conformidade por Setor</CardTitle>
            <CardDescription>Taxa de conformidade dos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SECTORS.map((sector) => {
                const sectorStat = mockStats.sectorStats.find(s => s.sector === sector.id);
                return (
                  <div key={sector.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${sector.color}`}></div>
                      <span className="text-sm font-medium">{sector.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={sectorStat?.conformityRate || 0} className="w-20 h-2" />
                      <span className="text-sm text-gray-600 w-12">
                        {sectorStat?.conformityRate || 0}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itens Mais Reprovados</CardTitle>
            <CardDescription>Top 5 itens com maior taxa de reprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Temperatura da câmara fria',
                'Higienização de utensílios',
                'Verificação de validade',
                'Limpeza de banheiros',
                'Organização da vitrine'
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item}</span>
                  <Badge variant="destructive" className="text-xs">
                    {Math.floor(Math.random() * 20 + 5)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente Principal
export default function ControleOperacional() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} onLogout={handleLogout} />
      
      {currentUser.role === 'employee' && <EmployeeDashboard user={currentUser} />}
      {currentUser.role === 'manager' && <ManagerDashboard user={currentUser} />}
      {currentUser.role === 'admin' && <AdminDashboard user={currentUser} />}
    </div>
  );
}