// src/pages/Dashboard.tsx
export default function DashboardPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white shadow rounded-lg p-4">จำนวนโครงการ: 85</div>
                <div className="bg-white shadow rounded-lg p-4">ผู้ปฏิบัติงาน: 155</div>
                <div className="bg-white shadow rounded-lg p-4">เหตุการณ์วันนี้: 2</div>
            </div>

            <div className="mt-6 bg-white shadow rounded-lg p-6 h-96">
                <h2 className="text-lg font-semibold mb-2">แผนที่</h2>
                <div className="bg-gray-200 h-full flex items-center justify-center rounded">
                    [TomTom Map หรือ Google Map Placeholder]
                </div>
            </div>
        </div>
    );
}
