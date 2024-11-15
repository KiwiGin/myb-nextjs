export function Circle({ color }: { color: string }) {
  return (
    <div>
      <div
        className={`rounded-full w-8 h-8 border-2 border-black`}
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

