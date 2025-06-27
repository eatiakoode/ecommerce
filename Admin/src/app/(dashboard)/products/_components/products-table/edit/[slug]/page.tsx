// import { X } from "lucide-react";

// import { Button } from "@/components/ui/button";

// export default function EditProduct({ product }: { product: any }) {
//   return (
//     <form className="bg-background p-6 rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-2">Edit Product</h2>
//       <p className="mb-6 text-muted-foreground">Update your product and necessary information from here</p>
//       <div className="grid gap-4 py-4">
//         <div className="grid grid-cols-4 items-center gap-4">
//           <label htmlFor="name" className="text-right">
//             Name
//           </label>
//           <input
//             id="name"
//             name="name"
//             defaultValue={product?.name || ""}
//             className="col-span-3 border rounded px-2 py-1"
//           />
//         </div>
//         <div className="grid grid-cols-4 items-center gap-4">
//           <label htmlFor="slug" className="text-right">
//             Slug
//           </label>
//           <input
//             id="slug"
//             name="slug"
//             defaultValue={product?.slug || ""}
//             className="col-span-3 border rounded px-2 py-1"
//             disabled
//           />
//         </div>
//         <div className="grid grid-cols-4 items-center gap-4">
//           <label htmlFor="price" className="text-right">
//             Price
//           </label>
//           <input
//             id="price"
//             name="price"
//             defaultValue={product?.price || ""}
//             className="col-span-3 border rounded px-2 py-1"
//             // disabled
//           />
//         </div>
        
//         {/* Add more fields as needed */}
//       </div>
//       <div className="flex gap-4 mt-6">
//         <Button variant="secondary" size="lg" type="button">
//           Cancel
//         </Button>
//         <Button size="lg" type="submit">
//           Save Changes
//         </Button>
//       </div>
//     </form>
//   );
// }
