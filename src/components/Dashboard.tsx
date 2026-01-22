import { Bell, ChevronDown, Home, Package, Mail, Users, Settings, Paintbrush, Wrench, Search, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Switch } from "./ui/switch"

interface DashboardProps {
  user?: {
    name: string;
    email: string;
  };
  onLogout?: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-md"></div>
          <span className="text-xl font-semibold">weblike</span>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Package className="mr-2 h-4 w-4" />
            Store
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Affiliates
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Paintbrush className="mr-2 h-4 w-4" />
            Design
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Wrench className="mr-2 h-4 w-4" />
            Setup
          </Button>
        </nav>
        <div className="pt-6 text-sm text-gray-500">
          Your application has been received and will be reviewed as soon as possible · <a href="#" className="text-purple-600">Help</a>
        </div>
        <div className="pt-6 flex items-center justify-between">
          <span className="text-sm font-medium">Test mode</span>
          <Switch />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Home</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button size="icon" className="bg-purple-600 text-white hover:bg-purple-700">
              <Plus className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2 border-l pl-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">{user?.name || "Demo User"}</span>
                <span className="text-xs text-gray-500">{user?.email || "demo@example.com"}</span>
              </div>
              {onLogout && (
                <Button variant="ghost" size="sm" onClick={onLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  Logout
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <div className="flex space-x-4">
            <Select defaultValue="date-range">
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="15 Sep, 2024 — 15 Oct, 2024" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-range">15 Sep, 2024 — 15 Oct, 2024</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="daily">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Daily" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-products">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-products">All Products</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <span>All revenue</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">$0.00</div>
              <div className="text-sm text-gray-500">vs. $0.00 last period</div>
              <div className="h-64 mt-4 border-b"></div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>15 Sep</span>
                <span>15 Oct</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <span>New orders</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">0</div>
                <div className="text-sm text-gray-500">vs. 0 last period</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <span>New order revenue</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$0.00</div>
                <div className="text-sm text-gray-500">vs. $0.00 last period</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <span>Avg. order revenue</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$0.00</div>
                <div className="text-sm text-gray-500">vs. $0.00 last period</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}