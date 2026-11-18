import { useMemo, useState } from 'react';
import { MessageCircle, Search, Trash2 } from 'lucide-react';
import { BookingInquiryRecord, useVenueData } from '../../context/VenueDataContext';

interface AdminInquiriesTabProps {
  inquiries: BookingInquiryRecord[];
  loading: boolean;
}

const STATUS_LABELS: Record<BookingInquiryRecord['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_CLASSES: Record<BookingInquiryRecord['status'], string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  completed: 'bg-slate-100 text-slate-700 border-slate-200',
  cancelled: 'bg-red-50 text-red-800 border-red-200',
};

export function AdminInquiriesTab({ inquiries, loading }: AdminInquiriesTabProps) {
  const { updateInquiryStatus, deleteInquiry, buildWhatsAppUrl } = useVenueData();
  const [statusFilter, setStatusFilter] = useState<'all' | BookingInquiryRecord['status']>('all');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((inq) => {
      const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
      const matchesSearch =
        !q ||
        inq.fullName.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q) ||
        inq.eventType.toLowerCase().includes(q) ||
        inq.eventDate.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [inquiries, statusFilter, search]);

  const handleStatusChange = async (id: string, status: BookingInquiryRecord['status']) => {
    setBusyId(id);
    try {
      await updateInquiryStatus(id, status);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await deleteInquiry(id);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-xl border border-[#E5E2E1] p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                statusFilter === status
                  ? 'bg-[#0B3B2E] text-[#F3DF98]'
                  : 'bg-[#FAF7F2] text-[#525B57] hover:text-[#0B3B2E]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#525B57] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, event date..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>
      </div>

      {/* Table / Empty / Loading */}
      {loading ? (
        <div className="bg-white rounded-xl border border-[#E5E2E1] p-6 space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-12 bg-[#FAF7F2] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E2E1] p-10 text-center">
          <p className="font-serif text-xl font-semibold text-[#0B3B2E]">
            No Booking Inquiries Found
          </p>
          <p className="text-sm text-[#525B57] mt-1">
            Inquiries submitted from the public Contact & Booking page will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E2E1] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5E2E1] text-xs font-semibold uppercase tracking-wider text-[#525B57]">
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Event Date & Shift</th>
                <th className="py-3.5 px-4">Event & Guests</th>
                <th className="py-3.5 px-4">Catering</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2E1] text-sm">
              {filtered.map((inq) => {
                const total = inq.gentsCount + inq.ladiesCount;
                const replyUrl = buildWhatsAppUrl(
                  `Assalam-o-Alaikum ${inq.fullName}, regarding your ${inq.eventType} inquiry at Nakreezay Shadi Hall for ${inq.eventDate} (${inq.eventShift})...`
                );
                return (
                  <tr key={inq.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#0B3B2E]">{inq.fullName}</p>
                      <p className="text-xs text-[#525B57] tabular-nums">{inq.phone}</p>
                      {inq.notes && (
                        <p className="text-xs text-[#525B57] mt-1 max-w-xs line-clamp-2">
                          {inq.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium tabular-nums text-[#1E1E1E]">{inq.eventDate}</p>
                      <p className="text-xs text-[#525B57]">{inq.eventShift}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#1E1E1E]">{inq.eventType}</p>
                      <p className="text-xs text-[#525B57] tabular-nums">
                        {total} Total ({inq.gentsCount}G / {inq.ladiesCount}L)
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[#1E1E1E]">
                      {inq.catering}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={inq.status}
                        disabled={busyId === inq.id}
                        onChange={(e) =>
                          handleStatusChange(
                            inq.id,
                            e.target.value as BookingInquiryRecord['status']
                          )
                        }
                        aria-label={`Status for ${inq.fullName}`}
                        className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold cursor-pointer ${
                          STATUS_CLASSES[inq.status]
                        }`}
                      >
                        {(Object.keys(STATUS_LABELS) as BookingInquiryRecord['status'][]).map(
                          (st) => (
                            <option key={st} value={st}>
                              {STATUS_LABELS[st]}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={replyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Reply via WhatsApp"
                          className="p-2 rounded-lg border border-[#E5E2E1] hover:border-[#15803D] text-[#15803D] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          disabled={busyId === inq.id}
                          onClick={() => handleDelete(inq.id)}
                          title="Delete inquiry"
                          className="p-2 rounded-lg border border-[#E5E2E1] hover:border-red-600 text-red-700 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
