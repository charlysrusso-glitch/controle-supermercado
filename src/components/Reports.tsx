"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  ClipboardList,
  AlertTriangle,
  Download,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';
import { SECTORS } from '@/lib/data';

interface ReportsProps {
  stats: {
    totalChecklists: number;
    completedToday: number;
    pendingApproval: number;
    openNCs: number;
    conformityRate: number;
    sectorStats: {
      sector: string;
      conformityRate: number;
      totalTasks: number;
      completedTasks: number;
    }[];
  };
}

export function Reports({ stats }: ReportsProps) {
  const topRejectedItems = [
    { item: 'Temperatura da câmara fria', rejectionRate: 18, sector: 'Açougue' },
    { item: 'Higienização de utensílios', rejectionRate: 15, sector: 'Açougue' },
    { item: 'Verificação de validade', rejectionRate: 12, sector: 'Padaria' },
    { item: 'Limpeza de banheiros', rejectionRate: 10, sector: 'Limpeza' },
    { item: 'Organização da vitrine', rejectionRate: 8, sector: 'Hortifruti' }
  ];

  const monthlyTrend = [
    { month: 'Jan', conformity: 92, ncs: 12 },
    { month: 'Fev', conformity: 94, ncs: 8 },
    { month: 'Mar', conformity: 91, ncs: 15 },
    { month: 'Abr', conformity: 96, ncs: 6 },
    { month: 'Mai', conformity: 94, ncs: 8 }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Relatórios e Analytics</h2>
          <p className="text-gray-600">Análise de performance e conformidade</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sectors">Por Setor</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="ncs">Não Conformidades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Conformidade</p>
                    <p className="text-2xl font-bold text-green-600">{stats.conformityRate}%</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">+2.3% vs mês anterior</span>
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Checklists Hoje</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.completedToday}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-blue-600">+5 vs ontem</span>
                    </div>
                  </div>
                  <ClipboardList className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">NCs Abertas</p>
                    <p className="text-2xl font-bold text-red-600">{stats.openNCs}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingDown className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-600">-2 vs semana anterior</span>
                    </div>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Funcionários Ativos</p>
                    <p className="text-2xl font-bold text-purple-600">24</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs text-gray-600">6 setores</span>
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Itens Mais Reprovados */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 - Itens Mais Reprovados</CardTitle>
              <CardDescription>Itens com maior taxa de reprovação nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRejectedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium text-red-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.item}</p>
                        <p className="text-sm text-gray-600">{item.sector}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={item.rejectionRate} className="w-20 h-2" />
                      <Badge variant="destructive" className="text-xs">
                        {item.rejectionRate}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Setor</CardTitle>
              <CardDescription>Taxa de conformidade e volume de tarefas por setor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {SECTORS.map((sector) => {
                  const sectorStat = stats.sectorStats.find(s => s.sector === sector.id) || {
                    conformityRate: Math.floor(Math.random() * 20 + 80),
                    totalTasks: Math.floor(Math.random() * 50 + 20),
                    completedTasks: Math.floor(Math.random() * 40 + 15)
                  };
                  
                  return (
                    <div key={sector.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${sector.color}`}></div>
                          <h4 className="font-medium text-gray-900">{sector.name}</h4>
                        </div>
                        <Badge 
                          className={sectorStat.conformityRate >= 95 ? 'bg-green-100 text-green-800' : 
                                   sectorStat.conformityRate >= 90 ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-red-100 text-red-800'}
                        >
                          {sectorStat.conformityRate}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Conformidade</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={sectorStat.conformityRate} className="flex-1 h-2" />
                            <span className="font-medium">{sectorStat.conformityRate}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Tarefas</p>
                          <p className="text-lg font-semibold text-gray-900">{sectorStat.totalTasks}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Concluídas</p>
                          <p className="text-lg font-semibold text-green-600">{sectorStat.completedTasks}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendência Mensal</CardTitle>
              <CardDescription>Evolução da conformidade e NCs nos últimos 5 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyTrend.map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="w-12">
                      <span className="text-sm font-medium text-gray-900">{month.month}</span>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Conformidade</span>
                            <span className="text-xs font-medium">{month.conformity}%</span>
                          </div>
                          <Progress value={month.conformity} className="h-2" />
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-xs text-gray-600">NCs: </span>
                          <span className="text-xs font-medium text-red-600">{month.ncs}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ncs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>NCs por Prioridade</CardTitle>
                <CardDescription>Distribuição das não conformidades por nível de prioridade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { priority: 'Crítica', count: 2, color: 'bg-red-500' },
                    { priority: 'Alta', count: 3, color: 'bg-orange-500' },
                    { priority: 'Média', count: 5, color: 'bg-yellow-500' },
                    { priority: 'Baixa', count: 1, color: 'bg-blue-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium">{item.priority}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={(item.count / 11) * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NCs por Setor</CardTitle>
                <CardDescription>Setores com maior número de não conformidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { sector: 'Açougue', count: 4, color: 'bg-red-500' },
                    { sector: 'Limpeza', count: 3, color: 'bg-cyan-500' },
                    { sector: 'Padaria', count: 2, color: 'bg-amber-500' },
                    { sector: 'Câmaras Frias', count: 2, color: 'bg-indigo-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium">{item.sector}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={(item.count / 4) * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}