# CIoT EPS Optimizations

## Cellular IoT Optimizations Overview (Release 13)

These optimizations dramatically reduce power consumption and signaling overhead for NB-IoT and LTE-M devices.

### Optimization Comparison

```mermaid
graph LR
    subgraph "Standard LTE Data Transfer"
        A1[UE] -->|RRC Setup| A2[eNB]
        A2 -->|S1-AP| A3[MME]
        A3 -->|Create Session| A4[S-GW]
        A4 -->|Create Session| A5[P-GW]
        A5 -->|Internet| A6[Server]
        style A1 fill:#ffcdd2
        style A6 fill:#ffcdd2
    end

    subgraph "CP CIoT Optimization"
        B1[UE] -->|NAS Data in<br/>Control Plane| B2[eNB]
        B2 -->|S1-AP| B3[MME]
        B3 -->|T6a| B4[SCEF]
        B4 -->|T8 API| B5[AS]
        style B1 fill:#c8e6c9
        style B5 fill:#c8e6c9
        note1[No S-GW/P-GW<br/>No user plane]
    end

    subgraph "UP CIoT Optimization"
        C1[UE] -->|RRC Suspend/Resume| C2[eNB]
        C2 -->|S1-U| C3[S-GW]
        C3 -->|S5| C4[P-GW]
        C4 -->|Internet| C5[Server]
        style C1 fill:#fff9c4
        style C5 fill:#fff9c4
        note2[User plane active<br/>Context preserved]
    end
```

## Control Plane CIoT Optimization

### Message Flow

```mermaid
sequenceDiagram
    participant UE as IoT UE
    participant eNB as eNodeB
    participant MME as MME
    participant SCEF as SCEF
    participant AS as App Server

    Note over UE,AS: Attach with CP CIoT Indication

    UE->>eNB: RRC Connection Request
    eNB->>UE: RRC Connection Setup
    UE->>eNB: RRC: Attach Request (CP CIoT capable)
    eNB->>MME: S1-AP: Attach Request

    MME->>MME: Check subscription<br/>CP CIoT allowed?

    MME->>eNB: S1-AP: Attach Accept (CP CIoT enabled)
    eNB->>UE: RRC: Attach Accept

    Note over UE,eNB: Connection released (suspend)
    eNB->>UE: RRC Connection Release (Suspend)

    Note over UE: UE enters PSM<br/>Deep sleep

    Note over UE,AS: --- Later: Uplink Data Transmission ---

    UE->>eNB: RRC Connection Request (Resume)
    eNB->>UE: RRC Connection Setup

    UE->>eNB: NAS: ESM Data Transport<br/>(Data in NAS PDU)
    Note right of UE: Max 1600 bytes<br/>No IP header needed

    eNB->>MME: S1-AP: Uplink NAS Transport

    MME->>SCEF: S11-U (GTP-U) or T6a<br/>Data Forwarding
    Note right of MME: MME acts as<br/>data gateway

    SCEF->>AS: HTTP POST<br/>External-ID routing

    AS-->>SCEF: HTTP 200 OK
    SCEF-->>MME: Delivery Report
    MME-->>eNB: S1-AP: Downlink NAS Transport (ACK)
    eNB-->>UE: NAS: ESM Data Transport (ACK)

    Note over UE,eNB: Immediate release
    eNB->>UE: RRC Connection Release
    Note over UE: Back to PSM
```

### NAS PDU Structure for CP CIoT

```
ESM Data Transport Message (TS 24.301 §8.3.21)
┌─────────────────────────────────────────┐
│ Protocol Discriminator (EPS SM = 0x2)  │ 1 byte
├─────────────────────────────────────────┤
│ EPS Bearer Identity (0x0 for default)  │ 4 bits
├─────────────────────────────────────────┤
│ Procedure Transaction ID                │ 4 bits
├─────────────────────────────────────────┤
│ Message Type (0xD9)                     │ 1 byte
├─────────────────────────────────────────┤
│ User Data Container                     │
│   - Data length (2 bytes)               │
│   - Data payload (max 1600 bytes)       │ Variable
├─────────────────────────────────────────┤
│ Optional: Release Assistance Indication │ TLV
│   - Indicates no more data follows      │
└─────────────────────────────────────────┘
```

## User Plane CIoT Optimization

### RRC Suspend/Resume Flow

```mermaid
sequenceDiagram
    participant UE as IoT UE
    participant eNB as eNodeB
    participant MME as MME
    participant SGW as S-GW
    participant PGW as P-GW
    participant Server as Server

    Note over UE,Server: Initial Connection Establishment

    UE->>eNB: RRC Connection Request
    eNB->>UE: RRC Connection Setup
    UE->>MME: NAS: Attach Request (UP CIoT capable)

    MME->>SGW: Create Session Request
    SGW->>PGW: Create Session Request
    PGW-->>SGW: Create Session Response (IP address)
    SGW-->>MME: Create Session Response

    MME->>UE: NAS: Attach Accept (IP: 10.1.2.3)

    Note over UE,Server: Data Transfer
    UE->>Server: IP Packet (UDP/TCP)
    Server-->>UE: Response

    Note over UE,eNB: *** RRC Connection Suspend ***

    eNB->>UE: RRC Connection Release (Suspend)
    Note right of UE: resumeIdentity stored<br/>AS security context kept<br/>S1-U bearers maintained

    eNB->>eNB: Store UE context<br/>(RRC, security, bearers)
    MME->>MME: UE in ECM-IDLE<br/>S1-U bearers preserved

    Note over UE: Deep sleep<br/>eDRX or PSM

    Note over UE,Server: --- Next Data Transmission (Fast Resume) ---

    UE->>eNB: RRC Connection Resume Request<br/>(with resumeIdentity)
    Note right of UE: Only 3 messages<br/>vs 10+ for full attach

    eNB->>eNB: Retrieve UE context
    eNB->>MME: S1-AP: UE Context Resume Indication

    eNB->>UE: RRC Connection Resume<br/>(Security already active)
    UE->>eNB: RRC Connection Resume Complete

    Note over UE,Server: Immediate Data Transfer
    UE->>Server: IP Packet (same IP address)
    Server-->>UE: Response

    Note over UE,eNB: Suspend again
    eNB->>UE: RRC Connection Release (Suspend)
```

### State Comparison

```mermaid
stateDiagram-v2
    [*] --> RRC_IDLE_Standard
    [*] --> RRC_SUSPENDED_CIoT

    state "Standard LTE States" as standard {
        RRC_IDLE_Standard --> RRC_CONNECTED_Standard : Full RRC Setup
        RRC_CONNECTED_Standard --> RRC_IDLE_Standard : RRC Release

        note right of RRC_IDLE_Standard
            Full attach required
            10+ message exchange
            ~2-5 seconds latency
            New IP address possible
        end note
    }

    state "UP CIoT Optimized States" as ciot {
        RRC_SUSPENDED_CIoT --> RRC_CONNECTED_CIoT : RRC Resume (3 msgs)
        RRC_CONNECTED_CIoT --> RRC_SUSPENDED_CIoT : RRC Release (Suspend)

        note right of RRC_SUSPENDED_CIoT
            Context preserved
            3 message exchange
            ~100-500 ms latency
            Same IP maintained
            NEW in Release 13
        end note
    }
```

## Optimization Decision Tree

```mermaid
graph TD
    Start[IoT Data Transmission] --> Q1{Data Size?}

    Q1 -->|< 200 bytes| Q2{Frequency?}
    Q1 -->|200-1600 bytes| Q3{IP required?}
    Q1 -->|> 1600 bytes| Standard[Standard LTE<br/>User Plane]

    Q2 -->|Very rare<br/>hours/days| CP[CP CIoT<br/>Control Plane]
    Q2 -->|Moderate<br/>minutes/hours| Q3

    Q3 -->|No - simple data| CP
    Q3 -->|Yes - need IP| UP[UP CIoT<br/>Suspend/Resume]

    CP --> CP_Benefits[Benefits:<br/>- Lowest power<br/>- Minimal signaling<br/>- No IP overhead<br/>- Max 1600 bytes]

    UP --> UP_Benefits[Benefits:<br/>- Fast resume<br/>- IP maintained<br/>- Larger data<br/>- Lower latency than full attach]

    Standard --> Std_Benefits[Use when:<br/>- Large data > 1600 bytes<br/>- Continuous connection<br/>- Low latency critical]

    style CP fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
    style UP fill:#fff9c4,stroke:#f57f17,stroke-width:3px
    style Standard fill:#ffcdd2,stroke:#c62828,stroke-width:2px
```

## Power Consumption Comparison

### Energy per Transmission

```mermaid
graph LR
    subgraph "CP CIoT (100 bytes)"
        CP_Energy[Total: ~70 mJ]
        CP_RRC[RRC Setup: 20 mJ]
        CP_Data[Data Tx: 30 mJ]
        CP_Release[Release: 20 mJ]
    end

    subgraph "UP CIoT Resume (500 bytes)"
        UP_Energy[Total: ~150 mJ]
        UP_Resume[RRC Resume: 40 mJ]
        UP_Data[Data Tx: 80 mJ]
        UP_Suspend[Suspend: 30 mJ]
    end

    subgraph "Standard LTE (500 bytes)"
        Std_Energy[Total: ~400 mJ]
        Std_Attach[Attach: 150 mJ]
        Std_Bearer[Bearer Setup: 100 mJ]
        Std_Data[Data Tx: 80 mJ]
        Std_Release[Release: 70 mJ]
    end

    style CP_Energy fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
    style UP_Energy fill:#fff9c4,stroke:#f57f17,stroke-width:3px
    style Std_Energy fill:#ffcdd2,stroke:#c62828,stroke-width:3px
```

## Signaling Overhead Comparison

| Metric | CP CIoT | UP CIoT (Resume) | Standard LTE |
|--------|---------|------------------|--------------|
| **Messages (UL+DL)** | 6-8 | 10-12 | 20-30 |
| **Signaling Bytes** | ~200 bytes | ~500 bytes | ~2000 bytes |
| **Time to Data** | ~100-300 ms | ~100-500 ms | ~2-5 seconds |
| **UE Power (mAh per tx)** | ~0.02 mAh | ~0.04 mAh | ~0.11 mAh |
| **Battery Life Impact** | 10+ years | 7-10 years | 2-5 years |
| **Network Load** | Lowest | Low | High |

## Configuration Requirements

### HSS Subscription Profile

```json
{
  "imsi": "234501234567890",
  "msisdn": "+44780012345",
  "apnConfiguration": {
    "apn": "iot.ciot.operator.com",
    "pdnType": "Non-IP",
    "ciotOptimization": {
      "cpCiot": {
        "enabled": true,
        "maxDataSize": 1600
      },
      "upCiot": {
        "enabled": true,
        "allowSuspend": true
      }
    }
  },
  "ratRestrictions": ["NB-IoT", "LTE-M"],
  "subscribedPeriodicRauTauTimer": 86400,
  "subscribedActiveTime": 60
}
```

### MME Configuration

```
CIoT Optimization Policy:
  CP CIoT:
    Enabled: Yes
    Max Data Size: 1600 bytes
    Allowed RATs: NB-IoT, Cat-M1
    Priority: High (prefer over UP CIoT for small data)

  UP CIoT:
    Enabled: Yes
    RRC Suspend Timeout: 3600 seconds
    Context Storage: 100000 UEs
    Allowed RATs: NB-IoT, Cat-M1

  Fallback:
    If CIoT fails: Standard EPS procedures
    Max retries: 3
```

## Performance Metrics

### Latency Breakdown

```
CP CIoT (100 byte transmission):
├── RRC Connection Setup: 50-100 ms
├── NAS Attach (if needed): 100-200 ms (cached: 0 ms)
├── Data in NAS signaling: 30-50 ms
├── SCEF processing: 20-50 ms
└── Total: 200-400 ms (subsequent: 100-150 ms)

UP CIoT Resume (500 byte transmission):
├── RRC Resume: 30-70 ms
├── Data transmission: 50-100 ms
└── Total: 80-170 ms

Standard LTE (500 byte transmission - cold start):
├── RRC Setup: 50-100 ms
├── Attach procedure: 200-500 ms
├── PDN connection: 300-700 ms
├── Data transmission: 50-100 ms
└── Total: 600-1400 ms
```

## Key Specifications

- **TS 23.401**: GPRS enhancements for E-UTRAN access
  - §5.3.4b: Control Plane CIoT EPS Optimization
  - §5.3.4c: User Plane CIoT EPS Optimization
  - §5.3.4a: Extended DRX for power saving
- **TS 24.301**: NAS protocol for EPS; Stage 3
  - §8.3.21: ESM DATA TRANSPORT message
  - §9.9.4.2B: ESM cause for CIoT optimization
- **TS 36.331**: E-UTRA RRC Protocol specification
  - §5.3.13: RRC connection suspend and resume procedures
- **TS 23.682**: Architecture enhancements to facilitate communications with packet data networks and applications
  - NIDD delivery for CP CIoT optimization
- **TS 36.321**: E-UTRA MAC protocol specification
  - Early Data Transmission (EDT) for CP CIoT

## Use Case Examples

### CP CIoT: Smart Metering
```
Application: Electricity meter reporting
Data: 80 bytes (meter reading + timestamp)
Frequency: Every 4 hours
Battery: 3000 mAh (AA cell)

Calculation:
- Transmissions per day: 6
- Energy per transmission: 0.02 mAh
- Daily consumption: 0.12 mAh
- Sleep current (PSM): 0.005 mA
- Daily sleep consumption: 0.12 mAh
- Total daily: 0.24 mAh
- Battery life: 3000 / 0.24 / 365 = 34 years
```

### UP CIoT: Asset Tracking
```
Application: Container GPS tracker
Data: 200 bytes (GPS + sensors)
Frequency: Every 15 minutes (while moving)
Battery: 5000 mAh (C cell)

Calculation:
- Transmissions per day: 96
- Energy per transmission: 0.04 mAh
- Daily consumption: 3.84 mAh
- Sleep current (eDRX): 0.05 mA
- Daily sleep consumption: 1.20 mAh
- Total daily: 5.04 mAh
- Battery life: 5000 / 5.04 / 365 = 2.7 years
```
