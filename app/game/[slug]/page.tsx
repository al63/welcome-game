export default function Game({ params }: { params: { slug: string } }) {
  return <div className="w-full">meowdy {params.slug}</div>;
}
