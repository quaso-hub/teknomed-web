import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<any>({
    name: "", category: "Konstruksi", desc: "", summary: "", slug: "", published: true, has_3d: false
  })
  
  // Upload State
  const [uploading3D, setUploading3D] = useState(false)
  const [activeProductId, setActiveProductId] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if(formData.id) {
       await supabase.from('products').update(formData).eq('id', formData.id)
    } else {
       await supabase.from('products').insert([formData])
    }
    setIsDialogOpen(false)
    fetchProducts()
  }

  const handleUpload3DModel = async (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading3D(true)
    setActiveProductId(productId)

    // 1. Upload ke Storage Bucket "3d-models"
    const filePath = `models/${Date.now()}_${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage.from('3d-models').upload(filePath, file)
    
    if (uploadError) {
      alert("Upload gagal: " + uploadError.message)
      setUploading3D(false)
      setActiveProductId(null)
      return
    }

    // 2. Dapatkan public URL
    const { data: publicUrlData } = supabase.storage.from('3d-models').getPublicUrl(filePath)
    
    // 3. Update tabel product_3d_assets
    await supabase.from('product_3d_assets').insert([{
      product_id: productId,
      asset_type: 'model',
      storage_path: publicUrlData.publicUrl
    }])
    
    // 4. Set produk has_3d = true (jika belum)
    await supabase.from('products').update({ has_3d: true }).eq('id', productId)

    alert("Berhasil unggah model 3D!")
    setUploading3D(false)
    setActiveProductId(null)
    fetchProducts() // refresh UI
  }

  const openForm = (prod: any = null) => {
    if(prod) {
      setFormData(prod)
    } else {
      setFormData({ name: "", category: "Konstruksi", desc: "", summary: "", slug: "", published: true, has_3d: false })
    }
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-widest">Katalog & 3D</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openForm(null)} className="uppercase text-xs tracking-wider">Tambah Produk Baru</Button>
          </DialogTrigger>
          <DialogContent className="admin-theme max-w-2xl bg-background text-foreground border-border">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-widest">{formData.id ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveProduct} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Produk</Label>
                  <Input value={formData.name} onChange={(e)=> setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Slug URL</Label>
                  <Input value={formData.slug} onChange={(e)=> setFormData({...formData, slug: e.target.value})} required placeholder="contoh-produk" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi Singkat</Label>
                <Input value={formData.desc} onChange={(e)=> setFormData({...formData, desc: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category} onChange={(e)=> setFormData({...formData, category: e.target.value})}
                >
                  <option value="Konstruksi">Konstruksi</option>
                  <option value="Penjualan">Penjualan</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" className="uppercase">Simpan Produk</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input placeholder="Cari nama produk..." className="max-w-sm" />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="uppercase text-xs w-[250px]">Nama Produk</TableHead>
              <TableHead className="uppercase text-xs">Kategori</TableHead>
              <TableHead className="uppercase text-xs text-center">Status 3D</TableHead>
              <TableHead className="uppercase text-xs text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">Memuat data produk...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">Belum ada data produk di Supabase.</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="font-semibold text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">/{product.slug}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs border px-2 py-1 bg-muted rounded">{product.category}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {product.has_3d ? (
                      <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">3D Ready</span>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-muted-foreground text-[10px] uppercase">Tidak Ada</span>
                        <div className="relative">
                           {uploading3D && activeProductId === product.id ? (
                             <span className="text-[10px] text-blue-500 animate-pulse">Mengunggah...</span>
                           ) : (
                             <>
                               <Input 
                                 type="file" 
                                 accept=".glb,.gltf" 
                                 className="absolute inset-0 opacity-0 cursor-pointer w-[120px]" 
                                 onChange={(e) => handleUpload3DModel(e, product.id)}
                                 title="Unggah Model 3D .GLB"
                               />
                               <Button size="sm" variant="secondary" className="h-6 text-[10px] uppercase cursor-pointer pointer-events-none">Unggah .GLB</Button>
                             </>
                           )}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" className="text-xs uppercase" onClick={() => openForm(product)}>Edit</Button>
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
