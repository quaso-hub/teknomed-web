import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInquiries = async () => {
    setLoading(true)
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    if (data) setInquiries(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('inquiries').update({ status }).eq('id', id)
    fetchInquiries()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500 hover:bg-blue-600'
      case 'contacted': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'quoted': return 'bg-purple-500 hover:bg-purple-600'
      case 'won': return 'bg-green-500 hover:bg-green-600'
      case 'lost': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-widest">Inquiry Inbox</h1>
        <Button onClick={fetchInquiries} variant="outline" className="uppercase text-xs tracking-wider">
          Refresh Data
        </Button>
      </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="uppercase text-xs w-[180px]">Tanggal</TableHead>
              <TableHead className="uppercase text-xs w-[200px]">Perusahaan & Kontak</TableHead>
              <TableHead className="uppercase text-xs min-w-[300px]">Pesan Kebutuhan</TableHead>
              <TableHead className="uppercase text-xs text-center w-[120px]">Status</TableHead>
              <TableHead className="uppercase text-xs text-right w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">Memuat data inquiry...</TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">Belum ada inquiry yang masuk.</TableCell>
              </TableRow>
            ) : (
              inquiries.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-sm">{item.company_name}</div>
                    <div className="text-xs text-muted-foreground">{item.contact_person}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">{item.email}</div>
                    <div className="text-xs text-muted-foreground">{item.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs bg-muted/50 p-3 rounded border whitespace-pre-wrap">
                      {item.message}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`uppercase text-[10px] ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateStatus(item.id, 'new')}>Tandai 'New'</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(item.id, 'contacted')}>Ubah 'Contacted'</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(item.id, 'quoted')}>Ubah 'Quoted'</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(item.id, 'won')}>Tandai 'Won' (Goal!)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(item.id, 'lost')}>Tandai 'Lost'</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
