import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings, AlertCircle, Users, Calendar, Eye, EyeOff } from 'lucide-react';

const BookingManagementSystem = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedErrorType, setSelectedErrorType] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [credentials, setCredentials] = useState({
    login: { id: '', password: '' },
    heavennet: { id: '', password: '', verified: false },
    ekichika: { id: '', password: '', verified: false }
  });
  const [settings, setSettings] = useState({
    autoSyncSite: '',
    autoSyncTime: '',
    operationStart: '',
    operationEnd: ''
  });

  // サンプルデータ
  const sampleWomen = [
    { name: 'A子', slots: { 0: null, 1: { site: 'ぴゅあらば', time: '0:00-1:10' }, 2: null, 3: null } },
    { name: 'B子', slots: { 0: null, 1: null, 2: { site: 'ヘブンネット', time: '2:00-3:00' }, 3: null } },
    { name: 'C子', slots: { 0: { site: '駅ちか', time: '0:30-1:30' }, 1: null, 2: null, 3: null } },
    { name: 'D子', slots: { 0: null, 1: null, 2: null, 3: { site: 'ぴゅあらば', time: '3:00-4:00' } } }
  ];

  const errorTypes = [
    { key: 'womanInfoError', label: '女性情報・シフト吸い取りエラー', count: 2 },
    { key: 'bookingInfoError', label: '予約情報吸い取りエラー', count: 5 },
    { key: 'bookingWriteError', label: '予約情報書き込みエラー', count: 1 }
  ];

  const sampleErrors = {
    womanInfoError: [
      { time: '2024-01-15 14:30', message: 'ヘブンネットからの女性情報取得に失敗しました' },
      { time: '2024-01-15 10:15', message: '駅ちかのシフト情報が不正な形式です' }
    ],
    bookingInfoError: [
      { time: '2024-01-15 15:45', message: '予約メール解析でエラーが発生しました' },
      { time: '2024-01-15 12:20', message: 'API接続がタイムアウトしました' }
    ],
    bookingWriteError: [
      { time: '2024-01-15 16:00', message: '予約情報の書き込みに失敗しました' }
    ]
  };

  const handleLogin = () => {
    if (credentials.login.id && credentials.login.password) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }
  };

  const handleCredentialCheck = (site) => {
    if (credentials[site].id && credentials[site].password) {
      setCredentials(prev => ({
        ...prev,
        [site]: { ...prev[site], verified: true }
      }));
    }
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const changeDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(`${i}時`);
    }
    return slots;
  };

  const generateTimeOptions = () => {
    const options = [{ value: '', label: '未選択' }];
    for (let i = 0; i <= 31; i++) {
      options.push({ value: `${i}:00`, label: `${i}時00分` });
    }
    return options;
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // ログイン画面
  if (!isLoggedIn) {
    return (
      <div className="login-container d-flex align-items-center justify-content-center">
        <div className="card login-card" style={{ width: '400px' }}>
          <div className="card-body p-5">
            <h2 className="card-title text-center mb-4">ログイン</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="ID"
                value={credentials.login.id}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  login: { ...prev.login, id: e.target.value }
                }))}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="PASS"
                value={credentials.login.password}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  login: { ...prev.login, password: e.target.value }
                }))}
              />
            </div>
            <button
              onClick={handleLogin}
              className="btn btn-primary w-100"
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
    );
  }

  // メインレイアウト
  return (
    <div className="booking-management-system">
      <div className="row g-0">
        {/* サイドバー */}
        <div className="col-md-3 col-lg-2">
          <div className="sidebar">
            <div className="p-3 border-bottom">
              <h5 className="text-white mb-0">予約管理システム</h5>
            </div>
            <nav className="nav flex-column">
              <button
                onClick={() => setCurrentPage('registration')}
                className={`nav-link d-flex align-items-center ${
                  currentPage === 'registration' ? 'active' : ''
                }`}
              >
                <Users className="me-2" size={18} />
                ID・PASS登録
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`nav-link d-flex align-items-center ${
                  currentPage === 'dashboard' ? 'active' : ''
                }`}
              >
                <Calendar className="me-2" size={18} />
                WEB予約状況
              </button>
              <button
                onClick={() => setCurrentPage('errorlog')}
                className={`nav-link d-flex align-items-center ${
                  currentPage === 'errorlog' ? 'active' : ''
                }`}
              >
                <AlertCircle className="me-2" size={18} />
                エラーログ
              </button>
              <button
                onClick={() => setCurrentPage('settings')}
                className={`nav-link d-flex align-items-center ${
                  currentPage === 'settings' ? 'active' : ''
                }`}
              >
                <Settings className="me-2" size={18} />
                設定
              </button>
            </nav>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="col-md-9 col-lg-10">
          <div className="main-content">

            {/* ID・PASS登録画面 */}
            {currentPage === 'registration' && (
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title mb-4">ID・PASS登録</h2>

                  {/* ヘブンネット */}
                  <div className="settings-section">
                    <h5>▼ヘブンネット</h5>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="form-label">ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={credentials.heavennet.id}
                          onChange={(e) => setCredentials(prev => ({
                            ...prev,
                            heavennet: { ...prev.heavennet, id: e.target.value, verified: false }
                          }))}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">PASS</label>
                        <div className="input-group">
                          <input
                            type={showPassword.heavennet ? "text" : "password"}
                            className="form-control"
                            value={credentials.heavennet.password}
                            onChange={(e) => setCredentials(prev => ({
                              ...prev,
                              heavennet: { ...prev.heavennet, password: e.target.value, verified: false }
                            }))}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => togglePasswordVisibility('heavennet')}
                          >
                            {showPassword.heavennet ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex align-items-end">
                        <button
                          onClick={() => handleCredentialCheck('heavennet')}
                          disabled={!credentials.heavennet.id || !credentials.heavennet.password}
                          className="btn btn-primary"
                        >
                          チェック
                        </button>
                      </div>
                    </div>
                    {credentials.heavennet.verified && (
                      <div className="mt-3">
                        <button className="btn btn-success me-2">保存</button>
                        <span className="text-success">✓ 認証完了</span>
                      </div>
                    )}
                  </div>

                  {/* 駅ちか */}
                  <div className="settings-section">
                    <h5>▼駅ちか</h5>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="form-label">ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={credentials.ekichika.id}
                          onChange={(e) => setCredentials(prev => ({
                            ...prev,
                            ekichika: { ...prev.ekichika, id: e.target.value, verified: false }
                          }))}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">PASS</label>
                        <div className="input-group">
                          <input
                            type={showPassword.ekichika ? "text" : "password"}
                            className="form-control"
                            value={credentials.ekichika.password}
                            onChange={(e) => setCredentials(prev => ({
                              ...prev,
                              ekichika: { ...prev.ekichika, password: e.target.value, verified: false }
                            }))}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => togglePasswordVisibility('ekichika')}
                          >
                            {showPassword.ekichika ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex align-items-end">
                        <button
                          onClick={() => handleCredentialCheck('ekichika')}
                          disabled={!credentials.ekichika.id || !credentials.ekichika.password}
                          className="btn btn-primary"
                        >
                          チェック
                        </button>
                      </div>
                    </div>
                    {credentials.ekichika.verified && (
                      <div className="mt-3">
                        <button className="btn btn-success me-2">保存</button>
                        <span className="text-success">✓ 認証完了</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ダッシュボード（WEB予約状況） */}
            {currentPage === 'dashboard' && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="card-title mb-0">WEB予約状況</h2>
                    <button
                      onClick={() => {
                        if (window.confirm('ヘブンネットからサイト取得を行います。')) {
                          alert('女性・シフト情報を取得しました');
                        }
                      }}
                      className="btn btn-success"
                    >
                      女性・シフト吸い取り
                    </button>
                  </div>

                  {/* 日付ナビゲーション */}
                  <div className="d-flex align-items-center justify-content-center mb-4">
                    <button
                      onClick={() => changeDate(-1)}
                      className="btn btn-outline-secondary"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="mx-4 fs-5 fw-semibold">
                      {formatDate(currentDate)}
                    </span>
                    <button
                      onClick={() => changeDate(1)}
                      className="btn btn-outline-secondary"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* 予約状況テーブル */}
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th style={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>
                            女性名
                          </th>
                          {generateTimeSlots().map((time, index) => (
                            <th key={index} className="text-center" style={{ minWidth: '80px' }}>
                              {time}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sampleWomen.map((woman, index) => (
                          <tr key={index}>
                            <td style={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }} className="fw-medium">
                              {woman.name}
                            </td>
                            {generateTimeSlots().map((_, timeIndex) => (
                              <td key={timeIndex} className="text-center">
                                {woman.slots[timeIndex] && (
                                  <div
                                    className="booking-slot"
                                    title={`${woman.slots[timeIndex].time}\n${woman.slots[timeIndex].site}`}
                                  >
                                    予約
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* エラーログ画面 */}
            {currentPage === 'errorlog' && (
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title mb-4">エラーログ</h2>
                  <div className="row">
                    {/* エラータイプ選択 */}
                    <div className="col-md-3">
                      <div className="list-group">
                        {errorTypes.map((type) => (
                          <button
                            key={type.key}
                            onClick={() => setSelectedErrorType(type.key)}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                              selectedErrorType === type.key ? 'active' : ''
                            }`}
                          >
                            <span className="small">{type.label}</span>
                            {type.count > 0 && (
                              <span className="badge bg-danger rounded-pill">
                                {type.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* エラー詳細 */}
                    <div className="col-md-9">
                      {selectedErrorType && sampleErrors[selectedErrorType] && (
                        <div>
                          <h5 className="mb-3">
                            {errorTypes.find(t => t.key === selectedErrorType)?.label}
                          </h5>
                          {sampleErrors[selectedErrorType].map((error, index) => (
                            <div key={index} className="error-item">
                              <div className="small text-danger mb-2">{error.time}</div>
                              <div>{error.message}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedErrorType && !sampleErrors[selectedErrorType] && (
                        <div className="text-center text-muted py-5">
                          選択されたエラータイプにエラーはありません
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 設定画面 */}
            {currentPage === 'settings' && (
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title mb-4">設定</h2>

                  {/* 女性情報・シフト吸い取りサイト設定 */}
                  <div className="settings-section">
                    <h5>女性情報・シフト吸い取りサイト</h5>
                    <select
                      className="form-select"
                      value={settings.autoSyncSite}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoSyncSite: e.target.value }))}
                    >
                      <option value="">未選択</option>
                      <option value="heavennet">ヘブンネット</option>
                      <option value="ekichika">駅ちか</option>
                    </select>
                  </div>

                  {/* 女性情報・シフト自動吸い取り時刻設定 */}
                  <div className="settings-section">
                    <h5>女性情報・シフト自動吸い取り時刻設定</h5>
                    <select
                      className="form-select"
                      value={settings.autoSyncTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoSyncTime: e.target.value }))}
                    >
                      {generateTimeOptions().map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ネット予約可能時間 */}
                  <div className="settings-section">
                    <h5>ネット予約可能時間</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label">開始時間</label>
                        <select
                          className="form-select"
                          value={settings.operationStart}
                          onChange={(e) => {
                            const start = e.target.value;
                            setSettings(prev => ({ ...prev, operationStart: start }));

                            // 終了時間が開始時間より前の場合、終了時間をリセット
                            if (settings.operationEnd && start &&
                                parseInt(start.split(':')[0]) >= parseInt(settings.operationEnd.split(':')[0])) {
                              alert('開始時間より終了時間を後にしてください');
                              setSettings(prev => ({ ...prev, operationEnd: '' }));
                            }
                          }}
                        >
                          {generateTimeOptions().map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">終了時間</label>
                        <select
                          className="form-select"
                          value={settings.operationEnd}
                          onChange={(e) => {
                            const end = e.target.value;

                            // 開始時間が設定されている場合、終了時間が開始時間より後かチェック
                            if (settings.operationStart && end &&
                                parseInt(settings.operationStart.split(':')[0]) >= parseInt(end.split(':')[0])) {
                              alert('開始時間より終了時間を後にしてください');
                              return;
                            }

                            setSettings(prev => ({ ...prev, operationEnd: end }));
                          }}
                        >
                          {generateTimeOptions().map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 保存ボタン */}
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        alert('設定を保存しました');
                      }}
                      className="btn btn-primary btn-lg"
                    >
                      設定を保存
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagementSystem;