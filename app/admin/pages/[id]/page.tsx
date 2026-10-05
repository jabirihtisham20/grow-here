import {PageEditor} from '@/components/admin/PageEditor';
export default async function EditCmsPage({params}:{params:Promise<{id:string}>}){const{id}=await params;return <PageEditor pageId={id}/>;}
