# NIDD Architecture: 5G with NEF

## Non-IP Data Delivery in 5G System (Release 15+)

### 5G NIDD Architecture with NEF

```mermaid
sequenceDiagram
    participant UE as IoT Device (UE)
    participant gNB as gNB / ng-eNB
    participant AMF as AMF
    participant SMF as SMF
    participant UPF as UPF
    participant NEF as NEF
    participant AF as Application Function

    Note over UE,AF: PDU Session Establishment for Non-IP PDN

    UE->>gNB: RRC Setup Request
    gNB->>UE: RRC Setup

    UE->>gNB: NAS: Registration Request
    gNB->>AMF: N2: Registration Request
    AMF->>UE: NAS: Registration Accept

    UE->>AMF: NAS: PDU Session Establishment Request<br/>PDN Type: Ethernet / Unstructured
    AMF->>SMF: Nsmf_PDUSession_CreateSMContext
    SMF->>UPF: N4: Session Establishment

    SMF->>NEF: Nnef_EventExposure_Subscribe<br/>PDU Session for NIDD

    Note over UE,AF: Mobile-Originated Data Transfer

    UE->>gNB: NAS: UL NAS Transport (Small Data)
    gNB->>AMF: N2: UL NAS Transport
    AMF->>SMF: Nsmf_PDUSession_UpdateSMContext

    SMF->>UPF: N4: Downlink Data Notification
    UPF->>NEF: N33: Data Delivery Notification

    NEF->>AF: Nnef API: Data Upload<br/>External ID / GPSI mapping
    Note right of NEF: NEF performs<br/>AF authorization<br/>& routing

    AF-->>NEF: HTTP 200 OK + ACK Data
    NEF-->>UPF: N33: Acknowledgement
    UPF-->>SMF: N4: Acknowledgement
    SMF-->>AMF: Nsmf_PDUSession_UpdateSMContext Response
    AMF-->>UE: NAS: DL NAS Transport (ACK)
```

### Mobile-Terminated Data via NEF

```mermaid
sequenceDiagram
    participant AF as Application Function
    participant NEF as NEF
    participant UDM as UDM
    participant AMF as AMF
    participant SMF as SMF
    participant UPF as UPF
    participant gNB as gNB
    participant UE as IoT Device

    Note over AF,UE: MT Data Delivery via NEF

    AF->>NEF: POST /nnef-eventexposure/v1/.../subscriptions<br/>Event: Data Delivery<br/>GPSI / External ID

    NEF->>UDM: Nudm_SDM_Get (Resolve GPSI → SUPI)
    UDM-->>NEF: SUPI + Serving AMF

    NEF->>AMF: Namf_Communication_N1N2MessageTransfer<br/>Target: SUPI, Payload: MT Data

    alt UE in CM-IDLE (5GMM-IDLE)
        AMF->>gNB: N2: Paging
        gNB->>UE: RRC: Paging
        UE->>gNB: RRC Connection Request
        gNB->>AMF: N2: Initial UE Message
    else UE in CM-CONNECTED
        Note over AMF,UE: Direct delivery
    end

    AMF->>UE: NAS: DL NAS Transport (MT Data)
    Note left of UE: Unstructured or<br/>Ethernet payload

    UE-->>AMF: NAS: UL NAS Transport (Delivery ACK)
    AMF-->>NEF: Delivery Report (Success/Failure)
    NEF-->>AF: Event Notification: Delivery Status
```

### 5G Service-Based Architecture for NIDD

```mermaid
graph TB
    subgraph "UE & RAN"
        UE[5G IoT Device<br/>NB-IoT/RedCap]
        gNB[gNB / ng-eNB]
    end

    subgraph "5G Core - Control Plane (SBA)"
        AMF[AMF<br/>Access & Mobility]
        SMF[SMF<br/>Session Management]
        PCF[PCF<br/>Policy Control]
        UDM[UDM<br/>Unified Data Mgmt]
        AUSF[AUSF<br/>Authentication]
        NRF[NRF<br/>NF Repository]
        NSSF[NSSF<br/>Slice Selection]
    end

    subgraph "5G Core - User Plane"
        UPF[UPF<br/>User Plane Function]
    end

    subgraph "Exposure Layer"
        NEF[NEF<br/>Network Exposure<br/>Function]
        NWDAF[NWDAF<br/>Analytics]
    end

    subgraph "Application Layer"
        AF[AF<br/>Application Function<br/>DM Server / IoT Platform]
    end

    UE -->|NR/LTE Uu| gNB
    gNB -->|N2 Control| AMF
    gNB -->|N3 User| UPF

    AMF -.->|Namf| SMF
    SMF -.->|Nsmf| AMF
    SMF -->|N4 PFCP| UPF
    SMF -.->|Nsmf| PCF
    AMF -.->|Namf| UDM
    AMF -.->|Namf| AUSF

    UPF -.->|N6 / N33| NEF
    NEF -.->|Nnef| UDM
    NEF -.->|Nnef| AMF
    NEF -.->|Nnef| SMF
    NEF -.->|Nnef| PCF

    NEF -->|N33 / AF API| AF
    NWDAF -.->|Nnwdaf| NEF
    AF -.->|Naf| PCF

    NRF -.->|Service Discovery| AMF
    NRF -.->|Service Discovery| SMF
    NRF -.->|Service Discovery| NEF

    style NEF fill:#e1f5ff,stroke:#01579b,stroke-width:3px
    style AMF fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style UE fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style AF fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    note1[Service-Based Interfaces:<br/>All NF-to-NF via HTTP/2 + JSON]
    note2[NEF provides unified<br/>exposure API to AF]

    style note1 fill:#e8f5e9,stroke:#2e7d32
    style note2 fill:#e1f5ff,stroke:#01579b
```

## NEF Exposure APIs for NIDD

### Nnef Service Operations (3GPP TS 29.522)

| Service Operation | Description | HTTP Method |
|-------------------|-------------|-------------|
| **Nnef_EventExposure** | Subscribe to UE events (reachability, location, etc.) | POST /subscriptions |
| **Nnef_TrafficInfluence** | Request traffic routing influence | POST /traffic-influence |
| **Nnef_PFDmanagement** | Packet Flow Description management | POST /pfd-management |
| **Nnef_AFsessionWithQoS** | Request QoS for AF session | POST /af-sessions |
| **Nnef_ChargeableParty** | Identify chargeable party | POST /chargeable-party |
| **Nnef_NIDD** | Non-IP Data Delivery | POST /nidd-configurations |

### NIDD Configuration API

```json
POST /nnef-nidd/v1/{afId}/configurations HTTP/2
Host: nef.operator.com
Content-Type: application/json
Authorization: Bearer <OAuth2_token>

{
  "externalId": "sensor-device-12345",
  "msisdn": "+44780012345",
  "niddConfiguration": {
    "mtcProviderId": "IoTProvider123",
    "duration": 86400,
    "reliableDataService": true,
    "rdsPorts": {
      "uplinkPort": 5000,
      "downlinkPort": 5001
    },
    "pdnEstablishmentOption": "DYNAMIC"
  },
  "notificationDestination": "https://iotplatform.example.com/notifications"
}
```

### MT Data Delivery Request

```json
POST /nnef-nidd/v1/{afId}/deliver HTTP/2
Host: nef.operator.com
Content-Type: application/json

{
  "externalId": "sensor-device-12345",
  "data": "SGVsbG8gSW9UIGV2aWNl",  // Base64 encoded
  "reliableDataService": true,
  "requestedRetransmissionTime": "2026-04-15T14:30:00Z",
  "deliveryWaitTime": 300
}
```

### Delivery Report Notification

```json
POST /notifications HTTP/2
Host: iotplatform.example.com
Content-Type: application/json

{
  "transaction": "txn-789012",
  "deliveryStatus": "SUCCESS",
  "externalId": "sensor-device-12345",
  "timestamp": "2026-04-15T14:25:33Z",
  "rdsPort": 5001
}
```

## NIDD vs Standard PDU Session

| Aspect | NIDD (Non-IP) | Standard PDU Session |
|--------|---------------|---------------------|
| **PDN Type** | Ethernet / Unstructured | IPv4 / IPv6 / IPv4v6 |
| **IP Address** | Not assigned | UE gets IP address |
| **Routing** | Via NEF to AF (external ID) | Standard IP routing |
| **Data Size** | Small (optimized for <1 KB) | Any size (standard MTU) |
| **Latency** | Optimized (control plane option) | Standard |
| **Power Consumption** | Lowest (CP optimization) | Higher (full user plane) |
| **Use Case** | Sensor data, alarms, commands | Video, browsing, bulk data |
| **NAT/Firewall** | Not applicable | May require consideration |

## 5G Power Saving Mechanisms

### RRC States in 5G

```mermaid
stateDiagram-v2
    [*] --> RRC_IDLE
    RRC_IDLE --> RRC_INACTIVE : Small data transmission
    RRC_INACTIVE --> RRC_CONNECTED : Resume / Full establishment
    RRC_CONNECTED --> RRC_INACTIVE : Suspend
    RRC_CONNECTED --> RRC_IDLE : Release
    RRC_INACTIVE --> RRC_IDLE : Context release
    RRC_IDLE --> RRC_CONNECTED : Network paging / MO data

    note right of RRC_IDLE
        No RRC context
        UE performs cell reselection
        DRX for paging
        Battery: ~5-10 μA
    end note

    note right of RRC_INACTIVE
        RRC context stored (gNB + UE)
        RNA (RAN Notification Area) based
        No need for full RRC re-establishment
        Battery: ~10-20 μA
        NEW in 5G!
    end note

    note right of RRC_CONNECTED
        Active data transfer
        Full context at gNB
        C-DRX possible
        Battery: ~50-200 mA
    end note
```

## Key Specifications

- **TS 23.501**: System architecture for the 5G System (5GS)
  - §5.6.7: Support for Non-IP PDU Session
  - §6.2.8: Network Exposure Function (NEF)
- **TS 23.502**: Procedures for the 5G System
  - §4.13.6: NIDD procedures
  - §4.15: Network capability exposure procedures
- **TS 29.522**: 5G System; Network Exposure Function Northbound APIs
  - NIDD configuration and delivery APIs
  - Event exposure for UE reachability
- **TS 38.331**: NR Radio Resource Control (RRC)
  - RRC_INACTIVE state procedures
  - Small Data Transmission (SDT)
- **TS 24.501**: NAS protocol for 5GS
  - PDU Session Establishment for Non-IP

## Evolution from SCEF to NEF

| Feature | SCEF (4G) | NEF (5G) | Improvement |
|---------|-----------|----------|-------------|
| **API Style** | RESTful (T8) | Service-based HTTP/2 | More scalable |
| **Authentication** | API keys / OAuth | OAuth 2.0 mandatory | Stronger security |
| **Analytics** | Limited | Via NWDAF integration | AI/ML insights |
| **Network Slicing** | Not supported | Full support | Isolation & QoS |
| **Event Framework** | Device-specific | Unified event exposure | Consistent API |
| **Charging** | Basic | Integrated with CHF | Fine-grained |
