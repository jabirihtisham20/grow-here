import { ResourceTable } from '@/components/admin/ResourceTable';

export default function ActivityPage() {
  return <div><h1 className="text-3xl font-semibold">Activity log</h1><p className="mb-6 mt-2 text-sm text-[#64806d]">Sign-ins and CMS security/content changes are recorded server-side.</p><ResourceTable endpoint="/api/admin/activity" collection="activity" columns={[{key:'created_at',label:'Time'},{key:'display_name',label:'User'},{key:'email',label:'Email'},{key:'action',label:'Action'},{key:'entity',label:'Type'},{key:'entity_id',label:'Record'}]} empty="No activity recorded."/></div>;
}
