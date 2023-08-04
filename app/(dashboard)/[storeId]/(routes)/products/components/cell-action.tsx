"use client"

import { Button } from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Copy, Edit, MoreHorizontal, Trash} from "lucide-react";
import toast from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";
import requestManager from "@/fetcher";
import {useState} from "react";
import AlertModal from "@/components/modals/alert-modal";
import {ProductColumn} from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";

interface CellActionProps {
    data: ProductColumn;
}

const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = () => {
        navigator.clipboard.writeText(data.id)
        toast.success("Product ID copied to the clipboard")
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await requestManager(`/api/${params.storeId}/products/${data.id}`, "DELETE")
            router.refresh()
            toast.success("Product deleted.")
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="
                            h-8
                            w-8
                            p-0
                        "
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={onCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default CellAction;