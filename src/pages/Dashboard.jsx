import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import KanbanBoard from "@/components/KanbanBoard";
import StatsCards from "../components/StatsCards";
import GamificationPanel from "../components/GamificationPanel";
import CardsCollection from "../components/CardsCollection";
import UnitsRanking from "../components/UnitsRanking";
import {
  RefreshCw,
  Filter,
  Trophy,
  Gamepad2,
  ChevronDown,
  Search,
  DollarSign,
  User,
  Building,
  FileText,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [kanbanData, setKanbanData] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showGamification, setShowGamification] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [apiError, setApiError] = useState(false);
  const { user, fetchWithFallback, isDevMode } = useAuth();

  // Estados dos filtros
  const [filters, setFilters] = useState({
    tipo_requisicao: "",
    criado_por: "",
    fornecedor: "",
    valor_min: "",
    valor_max: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setApiError(false);

      // Constrói query string com filtros
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      // Busca os cards do backend e agrupa por status
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cards?${queryParams.toString()}`
      );
      const data = await response.json();
      if (data.success && data.cards) {
        setKanbanData(groupByStatus(data.cards));
      } else {
        setKanbanData({});
        setApiError(true);
      }

      // Fetch stats usando fetchWithFallback
      const statsResult = await fetchWithFallback("/api/dashboard-stats");
      if (statsResult.success) {
        setStats(statsResult.data || {});
      } else {
        setStats(getMockStatsData());
        setApiError(true);
      }

      setLastUpdate(new Date());
    } catch (error) {
      setApiError(true);
      setKanbanData(getMockKanbanData());
      setStats(getMockStatsData());
      toast.error("Erro ao carregar dados. Exibindo dados de demonstração.");
    } finally {
      setLoading(false);
    }
  };

  const getMockKanbanData = () => {
    return {
      Solicitado: [
        {
          ID_RC: "RC-1001 (Mock)",
          Criado_Por: "CARLOS RAMOS",
          Valor_Estimado: 3383.18,
          Status: "Solicitado",
        },
        {
          ID_RC: "RC-1004 (Mock)",
          Criado_Por: "JOANA SILVA",
          Valor_Estimado: 1250.0,
          Status: "Solicitado",
        },
      ],
      "Em Análise": [
        {
          ID_RC: "RC-1002 (Mock)",
          Criado_Por: "MARIA LIMA",
          Valor_Estimado: 752.66,
          Status: "Em Análise",
        },
        {
          ID_RC: "RC-1005 (Mock)",
          Criado_Por: "PEDRO SANTOS",
          Valor_Estimado: 4200.0,
          Status: "Em Análise",
        },
      ],
      Aprovado: [
        {
          ID_RC: "RC-1003 (Mock)",
          Criado_Por: "JOSÉ PEREIRA",
          Valor_Estimado: 1890.25,
          Status: "Aprovado",
        },
      ],
      Recebido: [
        {
          ID_RC: "RC-1006 (Mock)",
          Criado_Por: "ANA OLIVEIRA",
          Valor_Estimado: 3750.5,
          Status: "Recebido",
        },
      ],
      Rejeitado: [
        {
          ID_RC: "RC-1007 (Mock)",
          Criado_Por: "ROBERTO ALVES",
          Valor_Estimado: 980.3,
          Status: "Rejeitado",
        },
      ],
    };
  };

  const getMockStatsData = () => {
    return {
      total_requisicoes: 100,
      valor_total: 250000,
      status_distribution: {
        Solicitado: 25,
        "Em Análise": 30,
        Aprovado: 20,
        Recebido: 15,
        Rejeitado: 10,
      },
    };
  };

  const addSampleData = async () => {
    try {
      setLoading(true);
      const result = await fetchWithFallback("/api/add-sample-data", {
        method: "POST",
      });

      if (result.success) {
        toast.success("Dados de exemplo adicionados com sucesso!");
        fetchData(); // Recarrega os dados
      } else {
        toast.error("Erro ao adicionar dados de exemplo");
      }
    } catch (error) {
      console.error("Erro ao adicionar dados de exemplo:", error);
      toast.error("Erro ao adicionar dados de exemplo");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      tipo_requisicao: "",
      criado_por: "",
      fornecedor: "",
      valor_min: "",
      valor_max: "",
    });
  };

  const applyFilters = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Aplica filtros quando mudam
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Função para agrupar cards por status
  const groupByStatus = (cards) => {
    return cards.reduce((acc, card) => {
      const status = card.Status || "Solicitado";
      if (!acc[status]) acc[status] = [];
      acc[status].push(card);
      return acc;
    }, {});
  };

  // Busca os cards do backend e agrupa por status
  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cards`);
      const data = await response.json();
      if (data.success && data.cards) {
        setKanbanData(groupByStatus(data.cards));
      }
    } catch (error) {
      setKanbanData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Dashboard Orbit
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhamento de Compras em Tempo Real - Unidade Maracanaú
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Bem-vindo, {user?.username} ({user?.role})
            {isDevMode && (
              <span className="ml-2 text-amber-600">
                [Modo Desenvolvimento]
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={apiError ? "destructive" : "outline"}
            className="text-sm"
          >
            Última atualização: {lastUpdate.toLocaleTimeString()}
            {apiError && <span className="ml-2">⚠️</span>}
          </Badge>

          <Button
            onClick={fetchData}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>

          <Button
            onClick={addSampleData}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Dados Exemplo</span>
          </Button>

          <Button
            onClick={() => setShowGamification(!showGamification)}
            variant={showGamification ? "default" : "outline"}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Gamepad2 className="h-4 w-4" />
            <span className="hidden sm:inline">Gamificação</span>
          </Button>

          <Button
            onClick={() => setShowCards(!showCards)}
            variant={showCards ? "default" : "outline"}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Cartas</span>
          </Button>

          <Button
            onClick={() => setShowRanking(!showRanking)}
            variant={showRanking ? "default" : "outline"}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Ranking</span>
          </Button>

          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "default" : "outline"}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
        </div>
      </div>

      {/* API Error Alert */}
      {apiError && (
        <Alert
          variant="warning"
          className="bg-amber-50 text-amber-800 border-amber-200"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Não foi possível conectar à API. Exibindo dados de demonstração.
            {isDevMode ? " (Modo de desenvolvimento ativo)" : ""}
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent>
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <Filter className="h-5 w-5" />
                <span>Filtros de Pesquisa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tipo de Requisição
                  </label>
                  <Select
                    value={filters.tipo_requisicao}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        tipo_requisicao: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os tipos</SelectItem>
                      <SelectItem value="Padrão">Padrão</SelectItem>
                      <SelectItem value="Contrato">Contrato</SelectItem>
                      <SelectItem value="Interna">Interna</SelectItem>
                      <SelectItem value="Delegada">Delegada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Criado Por</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nome do criador"
                      value={filters.criado_por}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          criado_por: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fornecedor</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nome do fornecedor"
                      value={filters.fornecedor}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          fornecedor: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor Mínimo</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={filters.valor_min}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          valor_min: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor Máximo</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="999.999,99"
                      value={filters.valor_max}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          valor_max: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
                <Button onClick={applyFilters}>Aplicar Filtros</Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Ranking por Unidades */}
      {showRanking && (
        <Card
          className={`border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 ${
            apiError ? "opacity-70" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Trophy className="h-5 w-5" />
              <span>Ranking por Unidades</span>
              {apiError && (
                <span className="ml-auto text-xs text-amber-600">
                  (Dados de demonstração)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UnitsRanking />
          </CardContent>
        </Card>
      )}

      {/* Gamification Panel */}
      {showGamification && (
        <Card
          className={`border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 ${
            apiError ? "opacity-70" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Gamepad2 className="h-5 w-5" />
              <span>Painel de Gamificação</span>
              {apiError && (
                <span className="ml-auto text-xs text-amber-600">
                  (Dados de demonstração)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GamificationPanel />
          </CardContent>
        </Card>
      )}

      {/* Cards Collection */}
      {showCards && (
        <Card
          className={`border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 ${
            apiError ? "opacity-70" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-indigo-800">
              <Sparkles className="h-5 w-5" />
              <span>Coleção de Cartas</span>
              {apiError && (
                <span className="ml-auto text-xs text-amber-600">
                  (Dados de demonstração)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardsCollection />
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} isMock={apiError} />

      {/* Kanban Board */}
      <Card className={apiError ? "opacity-90" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Quadro Kanban - Requisições de Compra</span>
            </span>
            <div className="flex items-center gap-2">
              {apiError && (
                <span className="text-xs text-amber-600 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Dados de demonstração
                </span>
              )}
              <Badge variant="secondary">
                {Object.values(kanbanData).flat().length} requisições
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <KanbanBoard
            data={kanbanData}
            loading={loading}
            onUpdate={fetchData}
            isMock={apiError}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
