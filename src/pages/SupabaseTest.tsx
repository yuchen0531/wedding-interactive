// src/pages/SupabaseTest.tsx
import { useEffect, useState } from "react"
import { supabase } from '../lib/supabase'

export default function SupabaseTest() {
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  // const [data, setData] = useState<any[]>([])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setMessage("")
		const { error } = await supabase.from("event").insert([{
        name,
        user_id: "test-user-001", // 實際應該改成登入者的ID
        content,
      },
	  ])
		if (error) {
			console.log('❌ 發生錯誤', error)
			setMessage(`❌ 發生錯誤: ${error.message}`)
		} else {
			setMessage(`✅ 寫入成功: ${name} - ${content}`)
			setName("")
			setContent("")
		}
		setLoading
	}
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("event").select("*")
      if (error) {
        console.error("❌ Supabase 讀取錯誤", error)
      } else {
        console.log("✅ Supabase 連線成功", data)
        // setData(data)
      }
    }

    fetchData()
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">💬 留言牆</h2>

      <input
        type="text"
        placeholder="你的名字"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="留言內容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
      >
        {loading ? "送出中..." : "送出留言"}
      </button>

      {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
    </form>
  )
}
