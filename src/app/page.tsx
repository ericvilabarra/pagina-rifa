'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Clock, Users, Trophy, Smartphone, Camera, Battery, Cpu, HardDrive, Instagram, Copy, Check, Star, Ticket, Shuffle, Gift, DollarSign, Lock, MessageCircle } from 'lucide-react'

export default function RifaPage() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [totalCotas] = useState(3000)
  const [cotasVendidas] = useState(0)
  const [copied, setCopied] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const [secondPrizeNumber, setSecondPrizeNumber] = useState<number | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false)

  // Cronômetro regressivo - 50 dias a partir de agora
  useEffect(() => {
    // Data final: 50 dias a partir de agora
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 50)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endDate.getTime() - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const generateRandomNumbers = (count: number) => {
    const available = Array.from({ length: totalCotas }, (_, i) => i + 1)
      .filter(num => !selectedNumbers.includes(num))
    
    const random = []
    for (let i = 0; i < Math.min(count, available.length); i++) {
      const randomIndex = Math.floor(Math.random() * available.length)
      random.push(available.splice(randomIndex, 1)[0])
    }
    
    setSelectedNumbers([...selectedNumbers, ...random])
  }

  const copyPixKey = () => {
    navigator.clipboard.writeText('77998378945')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyPixCode = () => {
    const valor = (selectedNumbers.length * 1).toFixed(2)
    const pixCode = generatePixCode(valor)
    navigator.clipboard.writeText(pixCode)
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 2000)
  }

  const generatePixCode = (valor: string) => {
    const pixKey = '77998378945'
    const nome = 'Eric Vilabarra'
    const cidade = 'Belmonte'
    const descricao = `Rifa Xiaomi Note 14 - ${selectedNumbers.length} cotas`
    
    // Formato PIX padrão brasileiro simplificado
    return `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${valor.length}${valor}5802BR5913${nome}6009${cidade}62${(7 + descricao.length).toString().padStart(2, '0')}05${descricao.length.toString().padStart(2, '0')}${descricao}6304A1B2`
  }

  const handleAdminLogin = () => {
    if (adminPassword === '20250208930') {
      setIsAdmin(true)
      setShowPasswordDialog(false)
      setAdminPassword('')
    } else {
      alert('Senha incorreta!')
      setAdminPassword('')
    }
  }

  const performDraw = () => {
    if (!isAdmin) {
      setShowPasswordDialog(true)
      return
    }

    setIsDrawing(true)
    setWinningNumber(null)
    setSecondPrizeNumber(null)
    
    // Simula o sorteio com animação
    let counter = 0
    const drawInterval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * totalCotas) + 1
      setWinningNumber(randomNum)
      counter++
      
      if (counter > 20) { // Para após 20 iterações
        clearInterval(drawInterval)
        
        // Números finais do sorteio
        const finalNumber = Math.floor(Math.random() * totalCotas) + 1
        let secondNumber = Math.floor(Math.random() * totalCotas) + 1
        
        // Garantir que o segundo prêmio seja diferente do primeiro
        while (secondNumber === finalNumber) {
          secondNumber = Math.floor(Math.random() * totalCotas) + 1
        }
        
        setWinningNumber(finalNumber)
        setSecondPrizeNumber(secondNumber)
        setIsDrawing(false)
      }
    }, 100)
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Gostaria de enviar o comprovante da compra das cotas da rifa do Xiaomi Note 14. 

Dados da compra:
- Nome: ${buyerInfo.name}
- Telefone: ${buyerInfo.phone}
- Números selecionados: ${selectedNumbers.map(n => n.toString().padStart(4, '0')).join(', ')}
- Valor total: R$ ${(selectedNumbers.length * 1).toFixed(2)}

Segue o comprovante em anexo.`)
    
    window.open(`https://wa.me/5577998378945?text=${message}`, '_blank')
  }

  const confirmPurchase = () => {
    if (!buyerInfo.name || !buyerInfo.phone) {
      alert('Por favor, preencha nome e telefone.')
      return
    }
    
    setPurchaseConfirmed(true)
    alert('Compra registrada! Agora faça o PIX e envie o comprovante via WhatsApp para confirmar seus números.')
  }

  const cotasDisponiveis = totalCotas - cotasVendidas
  const progressPercentage = (cotasVendidas / totalCotas) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">VILABARRA Premiações</h1>
            </div>
            <a 
              href="https://www.instagram.com/eric.vilabarra/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
            >
              <Instagram className="h-5 w-5" />
              <span className="font-medium">@eric.vilabarra</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Produto */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-blue-600 to-purple-700">
                <div className="absolute inset-0 bg-black/20"></div>
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/f84206b2-a7c7-4de5-9543-0399bd949bd9.jpg" 
                  alt="Xiaomi Note 14" 
                  className="w-full h-full object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Xiaomi Note 14</h2>
                    <p className="text-xl md:text-2xl font-light">O smartphone que você sempre quis!</p>
                    <Badge className="mt-4 bg-yellow-500 text-black text-lg px-4 py-2">
                      <Star className="h-5 w-5 mr-2" />
                      Prêmio Principal
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Seleção de Números */}
            <Card>
              <CardHeader>
                <CardTitle>Escolha seus Números</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => generateRandomNumbers(1)}
                    className="text-sm"
                  >
                    +1 Cota
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => generateRandomNumbers(5)}
                    className="text-sm"
                  >
                    +5 Cotas
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => generateRandomNumbers(10)}
                    className="text-sm"
                  >
                    +10 Cotas
                  </Button>
                </div>
                
                {selectedNumbers.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium">Números Selecionados:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedNumbers.map(num => (
                        <Badge key={num} variant="secondary" className="text-sm">
                          {num.toString().padStart(4, '0')}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setSelectedNumbers([])}
                      className="w-full"
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="font-medium">Total: R$ {(selectedNumbers.length * 1).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Valor por cota: R$ 1,00</p>
                </div>
              </CardContent>
            </Card>

            {/* Bilhetes Premiados */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Prêmio Principal */}
              <Card className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="text-center space-y-3">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto">
                        <Smartphone className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">1º Prêmio</h3>
                        <p className="text-yellow-100 text-sm">Xiaomi Note 14</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                        <div className="text-2xl font-bold font-mono">
                          {winningNumber ? winningNumber.toString().padStart(4, '0') : '????'}
                        </div>
                        <div className="text-xs text-yellow-100">Número Sorteado</div>
                      </div>
                    </div>
                    {winningNumber && !isDrawing && (
                      <div className="mt-3 p-3 bg-white/20 rounded-lg border border-white/30">
                        <div className="flex items-center justify-center space-x-2">
                          <Gift className="h-4 w-4" />
                          <span className="font-medium text-sm">Parabéns ao ganhador!</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>

              {/* Segundo Prêmio */}
              <Card className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 text-white overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="text-center space-y-3">
                      <div className="bg-white/20 p-3 rounded-full w-fit mx-auto">
                        <DollarSign className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">2º Prêmio</h3>
                        <p className="text-green-100 text-sm">R$ 100,00</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                        <div className="text-2xl font-bold font-mono">
                          {secondPrizeNumber ? secondPrizeNumber.toString().padStart(4, '0') : '????'}
                        </div>
                        <div className="text-xs text-green-100">Número Sorteado</div>
                      </div>
                    </div>
                    {secondPrizeNumber && !isDrawing && (
                      <div className="mt-3 p-3 bg-white/20 rounded-lg border border-white/30">
                        <div className="flex items-center justify-center space-x-2">
                          <Gift className="h-4 w-4" />
                          <span className="font-medium text-sm">Parabéns ao ganhador!</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* Finalizar Compra */}
            {selectedNumbers.length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Finalizar Compra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Comprar Cotas - R$ {(selectedNumbers.length * 1).toFixed(2)}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-center">Finalizar Pagamento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Resumo da Compra */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h3 className="font-semibold text-blue-800 mb-2">Resumo da Compra</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Quantidade de cotas:</span>
                              <span className="font-medium">{selectedNumbers.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Valor por cota:</span>
                              <span className="font-medium">R$ 1,00</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-blue-800 pt-2 border-t border-blue-200">
                              <span>Total a pagar:</span>
                              <span>R$ {(selectedNumbers.length * 1).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Dados do Comprador */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input 
                              id="name" 
                              value={buyerInfo.name}
                              onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                              placeholder="Seu nome completo"
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Telefone *</Label>
                            <Input 
                              id="phone" 
                              value={buyerInfo.phone}
                              onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                              placeholder="(11) 99999-9999"
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input 
                              id="email" 
                              type="email"
                              value={buyerInfo.email}
                              onChange={(e) => setBuyerInfo({...buyerInfo, email: e.target.value})}
                              placeholder="seu@email.com (opcional)"
                              className="h-11"
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Pagamento PIX */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-6 w-6 text-green-600" />
                            <h4 className="text-lg font-semibold text-gray-800">Pagamento via PIX</h4>
                          </div>
                          
                          <div className="space-y-4">
                            {/* Chave PIX */}
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Chave PIX (WhatsApp):</p>
                              <div className="flex items-center bg-gray-100 p-3 rounded-lg border">
                                <code className="text-sm font-mono flex-1 text-gray-800">77998378945</code>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={copyPixKey}
                                  className="ml-2 h-8"
                                >
                                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                              </div>
                              {copied && (
                                <p className="text-green-600 text-sm mt-1">✓ Chave PIX copiada!</p>
                              )}
                            </div>

                            {/* PIX Copia e Cola */}
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">PIX Copia e Cola:</p>
                              <div className="bg-gray-100 p-3 rounded-lg border">
                                <div className="flex items-start space-x-2">
                                  <code className="text-xs font-mono flex-1 text-gray-800 break-all leading-relaxed">
                                    {generatePixCode((selectedNumbers.length * 1).toFixed(2))}
                                  </code>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={copyPixCode}
                                    className="h-8 flex-shrink-0"
                                  >
                                    {pixCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </div>
                              {pixCopied && (
                                <p className="text-green-600 text-sm mt-1">✓ Código PIX copiado!</p>
                              )}
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <h5 className="font-medium text-yellow-800 mb-2">Instruções:</h5>
                              <div className="text-sm text-yellow-700 space-y-1">
                                <p>1. Confirme sua compra primeiro</p>
                                <p>2. Faça o PIX no valor de <strong>R$ {(selectedNumbers.length * 1).toFixed(2)}</strong></p>
                                <p>3. Use a chave PIX ou código copia e cola</p>
                                <p>4. Envie o comprovante via WhatsApp</p>
                                <p>5. Seus números serão confirmados após o pagamento</p>
                              </div>
                            </div>

                            {/* WhatsApp para envio do comprovante */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <MessageCircle className="h-5 w-5 text-green-600" />
                                <h5 className="font-medium text-green-800">Enviar Comprovante</h5>
                              </div>
                              <p className="text-sm text-green-700 mb-3">
                                Após fazer o PIX, envie o comprovante para nosso WhatsApp:
                              </p>
                              <div className="flex items-center bg-white p-2 rounded border">
                                <span className="text-sm font-mono flex-1 text-gray-800">+55 77 9837-8945</span>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => navigator.clipboard.writeText('+5577998378945')}
                                  className="ml-2 h-8"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium"
                            disabled={!buyerInfo.name || !buyerInfo.phone}
                            onClick={confirmPurchase}
                          >
                            {purchaseConfirmed ? 'Compra Confirmada ✓' : 'Confirmar Compra'}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 h-12 text-base"
                            onClick={openWhatsApp}
                            disabled={!purchaseConfirmed}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Enviar Comprovante
                          </Button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                          * Campos obrigatórios. Seus números só serão válidos após confirmação do pagamento.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {/* Tabs - Produto, Especificações e Sorteio */}
            <Tabs defaultValue="produto" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="produto">Produto</TabsTrigger>
                <TabsTrigger value="specs">Especificações</TabsTrigger>
                <TabsTrigger value="sorteio">Sorteio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="produto" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <img 
                          src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/26b9b27b-f7c1-4378-ae19-977bd0ed5d23.jpg" 
                          alt="Xiaomi Note 14 - Câmeras" 
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">Xiaomi Note 14</h3>
                        <p className="text-gray-600 leading-relaxed">
                          O Xiaomi Note 14 é um smartphone premium que combina design elegante com tecnologia de ponta. 
                          Com suas câmeras triplas de alta resolução e performance excepcional, é o dispositivo perfeito 
                          para quem busca qualidade e inovação.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Camera className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium">Câmera 108MP</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Battery className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium">Bateria 5000mAh</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Cpu className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium">Snapdragon 695</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <HardDrive className="h-5 w-5 text-orange-600" />
                            <span className="text-sm font-medium">128GB Storage</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specs" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <img 
                          src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/4539902c-aa7b-4772-9687-74112c2446af.jpg" 
                          alt="Xiaomi Note 14 - Especificações" 
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">Especificações Técnicas</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Processador:</span>
                            <span className="text-gray-900">Snapdragon 695 5G</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">RAM:</span>
                            <span className="text-gray-900">6GB</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Armazenamento:</span>
                            <span className="text-gray-900">128GB</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Tela:</span>
                            <span className="text-gray-900">6.43" AMOLED</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Câmera Principal:</span>
                            <span className="text-gray-900">108MP</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Bateria:</span>
                            <span className="text-gray-900">5000mAh</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Sistema:</span>
                            <span className="text-gray-900">Android 13</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sorteio" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shuffle className="h-6 w-6 text-purple-600" />
                      <span>Realizar Sorteio</span>
                      {isAdmin && (
                        <Badge variant="secondary" className="ml-2">
                          <Lock className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Primeiro Prêmio */}
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl">
                          <h4 className="font-bold text-gray-800 mb-2">1º Prêmio - Xiaomi Note 14</h4>
                          <div className="text-4xl font-bold font-mono text-gray-800 mb-2">
                            {isDrawing ? (
                              <span className="animate-pulse">
                                {winningNumber ? winningNumber.toString().padStart(4, '0') : '????'}
                              </span>
                            ) : (
                              winningNumber ? winningNumber.toString().padStart(4, '0') : '????'
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">
                            {isDrawing ? 'Sorteando...' : winningNumber ? 'Número Sorteado!' : 'Aguardando Sorteio'}
                          </p>
                        </div>

                        {/* Segundo Prêmio */}
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl">
                          <h4 className="font-bold text-gray-800 mb-2">2º Prêmio - R$ 100,00</h4>
                          <div className="text-4xl font-bold font-mono text-gray-800 mb-2">
                            {isDrawing ? (
                              <span className="animate-pulse">
                                {secondPrizeNumber ? secondPrizeNumber.toString().padStart(4, '0') : '????'}
                              </span>
                            ) : (
                              secondPrizeNumber ? secondPrizeNumber.toString().padStart(4, '0') : '????'
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">
                            {isDrawing ? 'Sorteando...' : secondPrizeNumber ? 'Número Sorteado!' : 'Aguardando Sorteio'}
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={performDraw}
                        disabled={isDrawing}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium"
                      >
                        {isDrawing ? (
                          <>
                            <Shuffle className="h-5 w-5 mr-2 animate-spin" />
                            Sorteando...
                          </>
                        ) : (
                          <>
                            <Shuffle className="h-5 w-5 mr-2" />
                            {isAdmin ? 'Realizar Sorteio' : 'Realizar Sorteio (Requer Autorização)'}
                          </>
                        )}
                      </Button>
                      
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>• O sorteio é realizado de forma aleatória</p>
                        <p>• Todos os números vendidos participam</p>
                        <p>• O resultado é instantâneo e transparente</p>
                        <p>• Dois números diferentes serão sorteados</p>
                        <p>• Apenas o administrador pode realizar o sorteio</p>
                      </div>
                    </div>
                    
                    {(winningNumber || secondPrizeNumber) && !isDrawing && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                        {winningNumber && (
                          <div className="flex items-center space-x-2 text-green-800">
                            <Trophy className="h-5 w-5" />
                            <span className="font-medium">
                              1º Prêmio: Parabéns ao portador do bilhete {winningNumber.toString().padStart(4, '0')}!
                            </span>
                          </div>
                        )}
                        {secondPrizeNumber && (
                          <div className="flex items-center space-x-2 text-green-800">
                            <DollarSign className="h-5 w-5" />
                            <span className="font-medium">
                              2º Prêmio: Parabéns ao portador do bilhete {secondPrizeNumber.toString().padStart(4, '0')}!
                            </span>
                          </div>
                        )}
                        <p className="text-green-700 text-sm mt-2">
                          Entre em contato via Instagram para retirar seu prêmio.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Compra */}
          <div className="space-y-6">
            {/* Cronômetro */}
            <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-6 w-6" />
                  <span>Tempo Restante</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm opacity-90">Dias</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm opacity-90">Horas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm opacity-90">Min</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-sm opacity-90">Seg</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status das Cotas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span>Status das Cotas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Vendidas: {cotasVendidas}</span>
                  <span>Disponíveis: {cotasDisponiveis}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  {progressPercentage.toFixed(1)}% vendido
                </p>
              </CardContent>
            </Card>

            {/* Avisos Importantes */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-800">
                  <Ticket className="h-6 w-6" />
                  <span>Avisos Importantes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-700">
                    📱 <strong>Estado do Produto:</strong> O celular tem 4 meses de uso, porém sem nenhuma marca de uso.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-700">
                    🎯 <strong>Sorteio:</strong> A rifa poderá ocorrer a qualquer momento após completar 50% da venda.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de Senha do Admin */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-red-600" />
              <span>Acesso Restrito</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Apenas o administrador pode realizar o sorteio. Digite a senha para continuar:
            </p>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha do Administrador</Label>
              <Input 
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Digite a senha"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleAdminLogin}
                className="flex-1"
                disabled={!adminPassword}
              >
                Entrar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPasswordDialog(false)
                  setAdminPassword('')
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold mb-4">VILABARRA Premiações</h3>
            <p className="text-gray-400 mb-4">Rifas transparentes e confiáveis</p>
            
            {/* Criador */}
            <div className="space-y-2">
              <p className="text-gray-300 font-medium">Criador</p>
              <a 
                href="https://www.instagram.com/eric.vilabarra/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span>@eric.vilabarra</span>
              </a>
            </div>

            {/* Patrocinadores */}
            <div className="space-y-3">
              <p className="text-gray-300 font-medium">Patrocinadores</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="https://www.instagram.com/urania_nascimento/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span>@urania_nascimento</span>
                </a>
                <a 
                  href="https://www.instagram.com/taxi_belmonte/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span>@taxi_belmonte</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}