import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Star,
  Zap,
  Shield,
  Crown,
  Gift,
  Shuffle,
  Lock,
  Unlock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com";

const CardsCollection = () => {
  const [allCards, setAllCards] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchCards();
    fetchUserCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cards`);
      const result = await response.json();

      // Ajuste para a chave 'cards' vinda do backend Flask
      if (result.success && result.cards) {
        setAllCards(result.cards);
      }
    } catch (error) {
      console.error("Erro ao carregar cartas:", error);
    }
  };

  const fetchUserCards = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/user-cards`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        setUserCards(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar cartas do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const unlockRandomCard = async () => {
    setUnlocking(true);
    try {
      const response = await fetch(
        `${API_URL}/api/unlock-random-card`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(
          `🎉 Nova carta desbloqueada: ${result.data.card.name}! (+${result.data.points_earned} pontos)`
        );
        fetchUserCards(); // Recarrega as cartas do usuário
      } else {
        toast.error(result.message || "Erro ao desbloquear carta");
      }
    } catch (error) {
      console.error("Erro ao desbloquear carta:", error);
      toast.error("Erro de conexão");
    } finally {
      setUnlocking(false);
    }
  };

  const activateCard = async (cardId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/activate-card/${cardId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.data.message);
      } else {
        toast.error(result.message || "Erro ao ativar carta");
      }
    } catch (error) {
      console.error("Erro ao ativar carta:", error);
      toast.error("Erro de conexão");
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "comum":
        return "border-gray-300 bg-gray-50";
      case "raro":
        return "border-blue-300 bg-blue-50";
      case "epico":
        return "border-purple-300 bg-purple-50";
      case "lendario":
        return "border-yellow-300 bg-yellow-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case "comum":
        return <Star className="h-4 w-4 text-gray-500" />;
      case "raro":
        return <Zap className="h-4 w-4 text-blue-500" />;
      case "epico":
        return <Shield className="h-4 w-4 text-purple-500" />;
      case "lendario":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "habilidade":
        return <Zap className="h-4 w-4 text-blue-600" />;
      case "bonus":
        return <Gift className="h-4 w-4 text-green-600" />;
      case "colecionavel":
        return <Star className="h-4 w-4 text-purple-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-gray-600" />;
    }
  };

  const isCardUnlocked = (cardId) => {
    return userCards.some((card) => card.id === cardId);
  };

  const collectionProgress = (userCards.length / allCards.length) * 100;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da Coleção */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Minha Coleção de Cartas
          </h3>
          <p className="text-gray-600">
            {userCards.length} de {allCards.length} cartas desbloqueadas
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Progresso da Coleção</div>
            <div className="text-lg font-bold text-indigo-600">
              {Math.round(collectionProgress)}%
            </div>
          </div>
          <div className="w-32">
            <Progress value={collectionProgress} className="h-2" />
          </div>
          <Button
            onClick={unlockRandomCard}
            disabled={unlocking}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            {unlocking ? "Desbloqueando..." : "Carta Aleatória"}
          </Button>
        </div>
      </div>

      {/* Grid de Cartas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allCards.map((card) => {
          const unlocked = isCardUnlocked(card.id);

          return (
            <Card
              key={card.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                unlocked
                  ? `border-2 ${getRarityColor(card.rarity)} hover:scale-105`
                  : "border-2 border-gray-200 bg-gray-100 opacity-60"
              }`}
            >
              {/* Indicador de Raridade */}
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                {getRarityIcon(card.rarity)}
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    card.rarity === "lendario"
                      ? "bg-yellow-100 text-yellow-800"
                      : card.rarity === "epico"
                      ? "bg-purple-100 text-purple-800"
                      : card.rarity === "raro"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {card.rarity}
                </Badge>
              </div>

              {/* Status de Desbloqueio */}
              <div className="absolute top-2 left-2">
                {unlocked ? (
                  <Unlock className="h-5 w-5 text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
              </div>

              <CardContent className="p-4 pt-8">
                <div className="space-y-3">
                  {/* Tipo da Carta */}
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(card.type)}
                    <Badge variant="outline" className="text-xs">
                      {card.type}
                    </Badge>
                  </div>

                  {/* Nome da Carta */}
                  <h4
                    className={`font-bold text-lg ${
                      unlocked ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {unlocked ? card.name : "???"}
                  </h4>

                  {/* Descrição */}
                  <p
                    className={`text-sm ${
                      unlocked ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {unlocked
                      ? card.description
                      : "Carta bloqueada. Continue jogando para desbloquear!"}
                  </p>

                  {/* Efeito (se houver) */}
                  {unlocked && card.effect && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        Efeito:
                      </div>
                      <div className="text-xs text-gray-600">{card.effect}</div>
                    </div>
                  )}

                  {/* Botão de Ação */}
                  {unlocked && card.type === "habilidade" && (
                    <Button
                      onClick={() => activateCard(card.id)}
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Ativar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estatísticas da Coleção */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["comum", "raro", "epico", "lendario"].map((rarity) => {
          const totalOfRarity = allCards.filter(
            (card) => card.rarity === rarity
          ).length;
          const unlockedOfRarity = userCards.filter(
            (card) => card.rarity === rarity
          ).length;

          return (
            <Card key={rarity} className="text-center">
              <CardContent className="pt-4">
                <div className="flex items-center justify-center mb-2">
                  {getRarityIcon(rarity)}
                </div>
                <div className="text-lg font-bold">
                  {unlockedOfRarity}/{totalOfRarity}
                </div>
                <div className="text-sm text-gray-600 capitalize">{rarity}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CardsCollection;
