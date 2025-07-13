import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings, AlertCircle, Users, Calendar, Eye, EyeOff, Shield, LogOut } from 'lucide-react';

const BookingManagementSystem = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'master' or 'user'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedErrorType, setSelectedErrorType] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [credentials, setCredentials] = useState({
    login: { id: '', password: '' },
    heavennet: { id: '', password: '', verified: false },
    ekichika: { id: '', password: '', verified: false },
    fuzoku_japan: { id: '', password: '', verified: false },
    purelovers: { id: '', password: '', verified: false },
    nuki_navi: { id: '', password: '', verified: false }
  });
  const [settings, setSettings] = useState({
    autoSyncSite: '',
    autoSyncTime: '',
    operationStart: '',
    operationEnd: ''
  });
  const [newAccount, setNewAccount] = useState({
    storeName: '',
    id: '',
    password: ''
  });
  const [userAccounts, setUserAccounts] = useState([
    { storeName: '店舗A', id: 'store_a', password: 'pass123' },
    { storeName: '店舗B', id: 'store_b', password: 'pass456' }
  ]);

  // サイト一覧
  const siteList = [
    { key: 'heavennet', label: 'ヘブンネット' },
    { key: 'ekichika', label: '駅ちか' },
    { key: 'fuzoku_japan', label: '風俗じゃぱん' },
    { key: 'purelovers', label: 'ぴゅあらば' },
    { key: 'nuki_navi', label: 'ぬきナビ' }
  ];

  // サンプルデータ（更新）
  const sampleWomen = [
    {
      name: 'A子',
      slots: {
        0: null,
        1: { site: 'ぴゅあらば', time: '1:00-2:10', customer: '田中様' },
        2: null,
        3: null,
        14: { site: 'ヘブンネット', time: '14:00-15:00', customer: '佐藤様' }
      }
    },
    {
      name: 'B子',
      slots: {
        0: null,
        1: null,
        2: { site: 'ヘブンネット', time: '2:00-3:00', customer: '鈴木様' },
        3: null,
        15: { site: '駅ちか', time: '15:30-16:30', customer: '山田様' }
      }
    },
    {
      name: 'C子',
      slots: {
        0: { site: '駅ちか', time: '0:30-1:30', customer: '高橋様' },
        1: null,
        2: null,
        3: null,
        11: { site: '風俗じゃぱん', time: '11:00-12:00', customer: '伊藤様' }
      }
    },
    {
      name: 'D子',
      slots: {
        0: null,
        1: null,
        2: null,
        3: { site: 'ぴゅあらば', time: '3:00-4:00', customer: '渡辺様' },
        20: { site: 'ぬきナビ', time: '20:00-21:00', customer: '加藤様' }
      }
    }
  ];

  const errorTypes = [
    { key: 'womanInfoError', label: '女性情報・シフト吸い取りエラー', count: 2 },
    { key: 'bookingInfoError', label: '予約情報吸い取りエラー', count: 5 },
    { key: 'bookingWriteError', label: '予約情報書き込みエラー', count: 1 }
  ];

  const sampleErrors = {
    womanInfoError: [
      { time: '2025-01-15 14:30', message: 'ヘブンネットからの女性情報取得に失敗しました' },
      { time: '2025-01-15 10:15', message: '駅ちかのシフト情報が不正な形式です' }
    ],
    bookingInfoError: [
      { time: '2025-01-15 15:45', message: '予約メール解析でエラーが発生しました' },
      { time: '2025-01-15 12:20', message: 'API接続がタイムアウトしました' }
    ],
    bookingWriteError: [
      { time: '2025-01-15 16:00', message: '予約情報の書き込みに失敗しました' }
    ]
  };

  const handleLogin = () => {
    if (credentials.login.id && credentials.login.password) {
      setIsLoggedIn(true);
      // マスターアカウントかどうかを判定
      if (credentials.login.id === 'master') {
        setUserRole('master');
      }
      // ログイン成功時はWEB予約状況画面に遷移
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

    // 過去未来3日間までの制限
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 3);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 3);

    if (newDate >= minDate && newDate <= maxDate) {
      setCurrentDate(newDate);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];

    // 設定で営業時間が設定されている場合はその範囲、未設定の場合は0-23時
    let startHour = 0;
    let endHour = 23;

    if (settings.operationStart && settings.operationEnd) {
      startHour = parseInt(settings.operationStart.split(':')[0]);
      endHour = parseInt(settings.operationEnd.split(':')[0]);
    }

    for (let i = startHour; i <= endHour; i++) {
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

  const formatBookingTime = (timeString) => {
    const [start, end] = timeString.split('-');
    return `${start}～${end}`;
  };

  const openBookingModal = (woman, timeIndex, existingBooking = null) => {
    if (existingBooking) {
      // 既存予約の場合は予約詳細のみ表示
      alert(`予約時間：${formatBookingTime(existingBooking.time)}\n予約サイト名：${existingBooking.site}`);
      return;
    }

    // 新規予約の場合はモーダルを開く
    setModalData({
      woman: woman.name,
      timeIndex,
      existingBooking,
      selectedWoman: woman.name,
      startTime: '',
      endTime: '',
      selectedSite: '',
      isEdit: false
    });
    setShowModal(true);
  };

  const handleSaveBooking = () => {
    // 予約保存ロジック
    alert(`予約を保存しました。各サイトに自動でウェブ予約状況が反映されます。`);
    setShowModal(false);
    setModalData(null);
  };

  const getRegisteredSites = () => {
    return siteList.filter(site => credentials[site.key]?.verified);
  };

  const addUserAccount = () => {
    if (newAccount.storeName && newAccount.id && newAccount.password) {
      setUserAccounts(prev => [...prev, { ...newAccount }]);
      setNewAccount({ storeName: '', id: '', password: '' });
      alert('ユーザーアカウントを追加しました');
    }
  };

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      setIsLoggedIn(false);
      setUserRole('user');
      setCurrentPage('login');
      setCredentials({
        login: { id: '', password: '' },
        heavennet: { id: '', password: '', verified: false },
        ekichika: { id: '', password: '', verified: false },
        fuzoku_japan: { id: '', password: '', verified: false },
        purelovers: { id: '', password: '', verified: false },
        nuki_navi: { id: '', password: '', verified: false }
      });
    }
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
            <div className="mt-3 text-center small text-muted">
              テスト用: ID「admin」PASS「admin123」<br/>
              マスター: ID「master」PASS「master123」
            </div>
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
              <small className="text-light">
                {userRole === 'master' ? 'マスターアカウント' : 'ユーザーアカウント'}
              </small>
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
              {/* マスターアカウントのみ表示 */}
              {userRole === 'master' && (
                <button
                  onClick={() => setCurrentPage('master')}
                  className={`nav-link d-flex align-items-center ${
                    currentPage === 'master' ? 'active' : ''
                  }`}
                >
                  <Shield className="me-2" size={18} />
                  マスター管理
                </button>
              )}

              {/* ログアウトボタン */}
              <button
                onClick={handleLogout}
                className="nav-link d-flex align-items-center text-danger mt-auto"
              >
                <LogOut className="me-2" size={18} />
                ログアウト
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

                  {siteList.map((site) => (
                    <div key={site.key} className="settings-section">
                      <h5>▼{site.label}</h5>
                      <div className="row">
                        <div className="col-md-4">
                          <label className="form-label">ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={credentials[site.key]?.id || ''}
                            onChange={(e) => setCredentials(prev => ({
                              ...prev,
                              [site.key]: { ...prev[site.key], id: e.target.value, verified: false }
                            }))}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">PASS</label>
                          <div className="input-group">
                            <input
                              type={showPassword[site.key] ? "text" : "password"}
                              className="form-control"
                              value={credentials[site.key]?.password || ''}
                              onChange={(e) => setCredentials(prev => ({
                                ...prev,
                                [site.key]: { ...prev[site.key], password: e.target.value, verified: false }
                              }))}
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => togglePasswordVisibility(site.key)}
                            >
                              {showPassword[site.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                          <button
                            onClick={() => handleCredentialCheck(site.key)}
                            disabled={!credentials[site.key]?.id || !credentials[site.key]?.password}
                            className="btn btn-primary"
                          >
                            チェック
                          </button>
                        </div>
                      </div>
                      {credentials[site.key]?.verified && (
                        <div className="mt-3">
                          <button className="btn btn-success me-2">保存</button>
                          <span className="text-success">✓ 認証完了</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WEB予約状況画面 */}
            {currentPage === 'dashboard' && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="card-title mb-0">WEB予約状況</h2>
                    <button
                      onClick={() => {
                        // 設定確認
                        if (!settings.autoSyncSite) {
                          alert('設定画面の女性情報・シフト吸い取りサイトを設定してください');
                          return;
                        }

                        const selectedSite = getRegisteredSites().find(s => s.key === settings.autoSyncSite);
                        const siteName = selectedSite ? selectedSite.label : settings.autoSyncSite;

                        if (window.confirm(`${siteName}からサイト取得を行います。`)) {
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
                              <td key={timeIndex} className="text-center" style={{ cursor: 'pointer' }}>
                                {woman.slots[timeIndex] ? (
                                  <div
                                    className="booking-slot"
                                    onClick={() => openBookingModal(woman, timeIndex, woman.slots[timeIndex])}
                                    title={`予約時間：${formatBookingTime(woman.slots[timeIndex].time)}\n予約サイト名：${woman.slots[timeIndex].site}\n${woman.slots[timeIndex].customer || ''}`}
                                  >
                                    予約
                                  </div>
                                ) : (
                                  <div
                                    className="empty-slot"
                                    onClick={() => openBookingModal(woman, timeIndex)}
                                    style={{ height: '30px', cursor: 'pointer' }}
                                    title="クリックして予約を追加"
                                  >
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
                      {getRegisteredSites().map((site) => (
                        <option key={site.key} value={site.key}>{site.label}</option>
                      ))}
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
                      {generateTimeOptions().slice(0, 25).map((option) => (
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

            {/* マスター管理画面 */}
            {currentPage === 'master' && userRole === 'master' && (
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title mb-4">マスター管理</h2>

                  {/* アカウント追加 */}
                  <div className="settings-section">
                    <h5>アカウント追加</h5>
                    <div className="row">
                      <div className="col-md-3">
                        <label className="form-label">店名</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newAccount.storeName}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, storeName: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newAccount.id}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, id: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">PASS</label>
                        <input
                          type="password"
                          className="form-control"
                          value={newAccount.password}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, password: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-3 d-flex align-items-end">
                        <button
                          onClick={addUserAccount}
                          disabled={!newAccount.storeName || !newAccount.id || !newAccount.password}
                          className="btn btn-primary"
                        >
                          追加
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ユーザーアカウント一覧 */}
                  <div className="settings-section">
                    <h5>ユーザーアカウント一覧</h5>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>店名</th>
                            <th>ID</th>
                            <th>PASS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userAccounts.map((account, index) => (
                            <tr key={index}>
                              <td>{account.storeName}</td>
                              <td>{account.id}</td>
                              <td>{account.password}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 予約モーダル */}
      {showModal && modalData && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">WEB予約追加</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">女性キャスト名</label>
                  <select
                    className="form-select"
                    value={modalData.selectedWoman}
                    onChange={(e) => setModalData(prev => ({ ...prev, selectedWoman: e.target.value }))}
                  >
                    {sampleWomen.map((woman) => (
                      <option key={woman.name} value={woman.name}>{woman.name}</option>
                    ))}
                  </select>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">開始時間</label>
                    <input
                      type="time"
                      className="form-control"
                      value={modalData.startTime}
                      onChange={(e) => setModalData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">終了時間</label>
                    <input
                      type="time"
                      className="form-control"
                      value={modalData.endTime}
                      onChange={(e) => setModalData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">予約サイト名</label>
                  <select
                    className="form-select"
                    value={modalData.selectedSite}
                    onChange={(e) => setModalData(prev => ({ ...prev, selectedSite: e.target.value }))}
                  >
                    <option value="">サイトを選択</option>
                    {getRegisteredSites().map((site) => (
                      <option key={site.key} value={site.label}>{site.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer flex-column">
                <button
                  onClick={handleSaveBooking}
                  disabled={!modalData.selectedWoman || !modalData.startTime || !modalData.endTime || !modalData.selectedSite}
                  className="btn btn-primary w-100"
                >
                  保存
                </button>
                <small className="text-muted mt-2">
                  ※保存すると各サイトに自動でウェブ予約状況が反映されます
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagementSystem;