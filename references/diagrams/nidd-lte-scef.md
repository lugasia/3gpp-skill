# NIDD Architecture: LTE/EPC with SCEF

## Non-IP Data Delivery in LTE (Release 13+)

### Control Plane CIoT Architecture

```mermaid
sequenceDiagram
    participant UE as IoT Device (UE)
    participant eNB as eNodeB
    participant MME as MME
    participant SCEF as SCEF
    participant AS as Application Server

    Note over UE,AS: Mobile-Originated NIDD (Control Plane)

    UE->>eNB: RRC Connection Request
    eNB->>UE: RRC Connection Setup
    UE->>eNB: RRC Connection Setup Complete

    UE->>eNB: NAS: Uplink NAS Transport (Data)
    Note right of UE: Max 1600 bytes<br/>in NAS message
    eNB->>MME: S1-AP: Uplink NAS Transport

    MME->>SCEF: S11-U: Data PDU (T6a)
    Note right of MME: CP CIoT optimization:<br/>Data in control plane

    SCEF->>AS: HTTP/REST API (T8)
    Note right of SCEF: Routing based on<br/>External ID or MSISDN

    AS-->>SCEF: Acknowledgement
    SCEF-->>MME: Acknowledgement
    MME-->>eNB: S1-AP: Downlink NAS Transport
    eNB-->>UE: NAS: Downlink NAS Transport (ACK)

    Note over UE,eNB: RRC Connection Release (Suspend)
    eNB->>UE: RRC Connection Release
    Note right of UE: UE enters PSM or eDRX
```

### Mobile-Terminated NIDD

```mermaid
sequenceDiagram
    participant AS as Application Server
    participant SCEF as SCEF
    participant MME as MME
    participant eNB as eNodeB
    participant UE as IoT Device (UE)

    Note over AS,UE: Mobile-Terminated NIDD via SCEF

    AS->>SCEF: HTTP POST /nidd (T8)<br/>Destination: External ID
    Note left of SCEF: SCEF resolves<br/>External ID to IMSI

    SCEF->>MME: S11-U: Downlink Data Notification (T6a)

    alt UE in PSM/Idle
        MME->>eNB: S1-AP: Paging
        eNB->>UE: Paging
        UE->>eNB: RRC Connection Request
        eNB->>UE: RRC Connection Setup
        UE->>eNB: RRC Connection Setup Complete
    else UE in RRC_CONNECTED
        Note over MME,UE: Skip paging, direct delivery
    end

    MME->>eNB: S1-AP: Downlink NAS Transport
    eNB->>UE: NAS: Downlink NAS Transport (Data)
    Note left of UE: Max 1600 bytes

    UE-->>eNB: NAS: Uplink NAS Transport (ACK)
    eNB-->>MME: S1-AP: Uplink NAS Transport
    MME-->>SCEF: S11-U: Delivery Report (T6a)
    SCEF-->>AS: HTTP Response: Delivery Status
```

### Network Architecture

```mermaid
graph TB
    subgraph "IoT Device"
        UE[NB-IoT/LTE-M UE]
    end

    subgraph "RAN"
        eNB[eNodeB]
    end

    subgraph "EPC Core Network"
        MME[MME]
        HSS[HSS]
        SGW[S-GW]
        PGW[P-GW]
    end

    subgraph "Service Layer"
        SCEF[SCEF<br/>Service Capability<br/>Exposure Function]
    end

    subgraph "Application Layer"
        SCS[SCS/AS<br/>Application Server]
    end

    UE -->|LTE-Uu| eNB
    eNB -->|S1-MME| MME
    eNB -.->|S1-U| SGW

    MME -->|S11| SGW
    MME -->|T6a Diameter/GTP| SCEF
    MME -->|S6a| HSS

    SGW -.->|S5| PGW

    SCEF -->|T6b| HSS
    SCEF -->|T8 REST API| SCS

    HSS -->|Subscription Data| SCEF

    style SCEF fill:#e1f5ff,stroke:#01579b,stroke-width:3px
    style MME fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style UE fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px

    classDef cpPath stroke:#d32f2f,stroke-width:4px,stroke-dasharray: 5 5
    class MME,SCEF cpPath

    note1[Control Plane Path:<br/>UE → eNB → MME → SCEF → AS]
    note2[No S-GW/P-GW for CP CIoT]

    style note1 fill:#ffebee,stroke:#c62828
    style note2 fill:#ffebee,stroke:#c62828
```

## NIDD PDN Type Configuration

### HSS Subscription Data

```
Subscriber Profile:
  IMSI: 234501234567890
  External Identifier: sensor-12345@example.com
  MSISDN: +44780012345

  APN: "nidd.iot.operator.com"
    PDN Type: Non-IP
    SCEF ID: scef1.operator.com
    SCEF Realm: operator.com

  Power Saving:
    PSM: Enabled
      T3324 (Active Timer): 60 seconds
      T3412 ext (TAU Timer): 24 hours
    eDRX: Enabled
      eDRX Cycle: 163.84 seconds
      PTW: 10.24 seconds
```

## Message Size Limits

| Transport Method | Max Message Size | Latency | Power | Use Case |
|------------------|------------------|---------|-------|----------|
| CP CIoT (NIDD) | 1600 bytes | ~2-5s | Lowest | Sensor readings, alarms |
| UP CIoT (Suspend/Resume) | Standard IP MTU | ~1-3s | Low | Moderate data, firmware |
| Standard LTE | No limit | <1s | Higher | Video, bulk data |

## Key Specifications

- **TS 23.682**: Architecture enhancements to facilitate communications with packet data networks and applications
  - §5.13.2: NIDD via SCEF
  - §5.13.1: Device triggering
  - §5.13.4: Monitoring event
- **TS 23.401**: GPRS enhancements for E-UTRAN access
  - §5.3.4b: Control Plane CIoT EPS optimization
  - §5.3.4c: User Plane CIoT EPS optimization
- **TS 24.301**: NAS protocol for EPS
  - §6.5.1.4: ESM procedures for Non-IP PDN connection
  - §9.9.4.x: ESM information elements for NIDD
- **TS 29.336**: Home Subscriber Server (HSS) diameter interfaces for interworking with packet data networks and applications (T6a/T6b)
- **TS 29.128**: Tsp interface protocol between the MTC Interworking Function (MTC-IWF) and Service Capability Server (SCS) (T8)
