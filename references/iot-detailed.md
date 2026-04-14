# 3GPP Cellular IoT - Detailed Reference

## Table of Contents

1. [Cellular IoT Technologies](#cellular-iot-technologies)
2. [NIDD (Non-IP Data Delivery)](#nidd-non-ip-data-delivery)
3. [SCEF vs NEF (Network Exposure)](#scef-vs-nef-network-exposure)
4. [CIoT EPS Optimizations](#ciot-eps-optimizations)
5. [Power Saving: eDRX & PSM](#power-saving-edrx--psm)
6. [SGP.32 eSIM for IoT](#sgp32-esim-for-iot)
7. [Device Management Integration](#device-management-integration)
8. [Cellular IoT vs Other LPWAN](#cellular-iot-vs-other-lpwan)
9. [Architecture Diagrams](#architecture-diagrams)
10. [Key Specifications Quick Reference](#key-specifications-quick-reference)

---

## Cellular IoT Technologies

### Technology Comparison Matrix

| Feature | NB-IoT | LTE-M (Cat-M1) | RedCap | Standard 5G NR |
|---------|--------|----------------|--------|----------------|
| **Release** | Rel-13 (2016) | Rel-13 (2016) | Rel-17 (2022) | Rel-15 (2018) |
| **Bandwidth** | 180 kHz (1 PRB) | 1.4 MHz (6 PRBs) | 20 MHz FR1 | 100+ MHz |
| **Peak Rate DL** | ~250 kbps | ~1 Mbps | ~150 Mbps | Multi-Gbps |
| **Peak Rate UL** | ~250 kbps | ~1 Mbps | ~50 Mbps | 1+ Gbps |
| **Duplex** | Half-duplex | Half-duplex | Half/Full-duplex | Full-duplex |
| **Mobility** | Limited | Full | Full | Full |
| **Voice** | No (data only) | Yes (VoLTE) | Yes (VoNR) | Yes |
| **Coverage** | +20 dB vs GPRS | +15 dB vs LTE | Standard 5G | Standard 5G |
| **Latency (typical)** | 1-10 seconds | 50-100 ms | 10-20 ms | 1-5 ms |
| **Power Class** | 20-23 dBm | 20-23 dBm | 23 dBm | 23-31 dBm |
| **Battery Life** | 10+ years | 10+ years | 5-10 years | 1-3 years |
| **Module Cost** | $2-5 | $3-8 | $10-20 | $30-100 |
| **Deployment** | In-band / Guard-band / Standalone | In-band LTE | 5G network | 5G network |
| **eDRX/PSM** | Yes | Yes | Yes | Yes (enhanced) |
| **NIDD** | Yes | Yes | Via 5GC | Via 5GC |
| **Positioning** | Basic | Enhanced | Advanced | cm-level |

### Use Case Suitability

```
Ultra-Low Power, Static, Small Data:
├─ Smart Meters (electricity, water, gas)
├─ Environmental Sensors (air quality, soil)
├─ Parking Sensors
└─ Building Automation (HVAC monitoring)
   → Use: NB-IoT

Low Power, Mobile, Moderate Data:
├─ Asset Tracking (containers, pallets)
├─ Fleet Management
├─ Wearables (health monitors, smartwatches)
└─ Pet Trackers
   → Use: LTE-M (Cat-M1)

Moderate Power, Video/Voice, Mobile:
├─ Industrial Sensors (with video)
├─ Surveillance Cameras
├─ Point-of-Sale Terminals
├─ Body Cameras
└─ Smart Glasses
   → Use: RedCap

High Throughput, Low Latency:
├─ Autonomous Vehicles
├─ Industrial Robotics
├─ AR/VR Applications
└─ High-Definition Video
   → Use: Standard 5G NR
```

---

## NIDD (Non-IP Data Delivery)

### Architecture Overview

NIDD enables IoT devices to transmit data without IP addresses, reducing overhead and power consumption.

#### LTE/EPC Architecture (Release 13-14)

```
┌─────────────┐
│  IoT Device │ (NB-IoT / LTE-M)
│     (UE)    │
└──────┬──────┘
       │ LTE-Uu (Radio)
       ▼
┌─────────────┐
│   eNodeB    │
└──────┬──────┘
       │ S1-MME (Control)
       ▼
┌─────────────┐         ┌─────────────┐
│     MME     │◄───────►│     HSS     │
│             │  S6a    │             │
└──────┬──────┘         └─────────────┘
       │ T6a (NIDD)
       ▼
┌─────────────┐         ┌─────────────┐
│    SCEF     │◄───────►│     HSS     │
│             │  T6b    │             │
└──────┬──────┘         └─────────────┘
       │ T8 (REST API)
       ▼
┌─────────────┐
│Application  │
│   Server    │
└─────────────┘

Key Interfaces:
- T6a: MME ↔ SCEF (Diameter or GTP-U for NIDD)
- T6b: SCEF ↔ HSS (subscription data)
- T8: SCEF ↔ SCS/AS (RESTful API)
```

#### 5G Architecture (Release 15+)

```
┌─────────────┐
│  IoT Device │ (NB-IoT / RedCap / 5G)
│     (UE)    │
└──────┬──────┘
       │ NR/LTE Uu
       ▼
┌─────────────┐
│  gNB/ng-eNB │
└──────┬──────┘
       │ N2 (Control) / N3 (User)
       ▼
┌─────────────┐         ┌─────────────┐
│     AMF     │◄───────►│     UDM     │
│             │  Nudm   │             │
└──────┬──────┘         └─────────────┘
       │ Namf
       ▼
┌─────────────┐         ┌─────────────┐
│     SMF     │◄───────►│     PCF     │
│             │  Npcf   │             │
└──────┬──────┘         └─────────────┘
       │ N4 (PFCP)
       ▼
┌─────────────┐
│     UPF     │
└──────┬──────┘
       │ N6 / N33
       ▼
┌─────────────┐         ┌─────────────┐
│     NEF     │◄───────►│   NWDAF     │
│             │  Nnef   │  (Analytics)│
└──────┬──────┘         └─────────────┘
       │ N33 / AF API
       ▼
┌─────────────┐
│ Application │
│  Function   │
└─────────────┘

Key Service-Based Interfaces (SBI):
- Namf: AMF services
- Nsmf: SMF services
- Nnef: NEF services (event exposure, NIDD)
- N33: External application exposure
```

### NIDD Message Types

| Direction | LTE (via SCEF) | 5G (via NEF) | Max Size | Transport |
|-----------|----------------|--------------|----------|-----------|
| Mobile-Originated | UE → SCEF → AS | UE → NEF → AF | 1600 bytes (CP) | NAS signaling |
| Mobile-Terminated | AS → SCEF → UE | AF → NEF → UE | 1600 bytes (CP) | NAS signaling |
| Device Trigger | AS → SCEF → UE (SMS) | AF → NEF → UE | 140 bytes | SMS / NAS |

### NIDD vs IP PDN Session

| Aspect | NIDD (Non-IP) | IP PDN Session |
|--------|---------------|----------------|
| **IP Address** | Not assigned | IPv4/IPv6 assigned |
| **Routing** | External ID / MSISDN | IP routing tables |
| **Header Overhead** | ~10 bytes (NAS) | ~40 bytes (IPv4), ~60 bytes (IPv6) |
| **NAT Traversal** | Not needed | May be required |
| **Firewall** | Not applicable | Must configure |
| **Application Protocols** | Raw binary | TCP, UDP, HTTP, CoAP, MQTT, etc. |
| **Power Consumption** | Lowest (CP CIoT) | Higher (full user plane) |
| **Use Case** | Sensor data, alarms, commands | Standard Internet connectivity |

---

## SCEF vs NEF (Network Exposure)

### Functional Comparison

| Function | SCEF (4G EPC) | NEF (5G Core) |
|----------|---------------|---------------|
| **Architecture** | Reference point model | Service-Based Architecture |
| **API Protocol** | REST (T8), Diameter (T6a/T6b) | HTTP/2 + JSON (all SBI) |
| **Device Triggering** | SMS, IWK-SCEF | Enhanced via NEF, NAS |
| **NIDD Support** | Yes (via T6a/T8) | Yes (via Nnef/N33) |
| **Monitoring Events** | Location, roaming, reachability | All + analytics (NWDAF) |
| **Group Messaging** | Yes | Enhanced with slicing |
| **QoS Control** | Limited | Full AF session with QoS |
| **Analytics** | Basic | AI/ML via NWDAF integration |
| **Network Slicing** | Not supported | Full slice exposure |
| **Charging** | Basic | Fine-grained via CHF |
| **Security** | API keys, OAuth | OAuth 2.0 mandatory |

### SCEF Functions (Release 13-14)

**Core Capabilities:**
1. **Device Triggering**: Wake sleeping IoT devices via SMS or IWK-SCEF
2. **Monitoring Events**:
   - Location reporting (cell ID, TAI, geographic area)
   - Roaming status (home/visited PLMN)
   - UE reachability (available, unreachable, periodic)
   - Communication failure (radio link failure, PDN disconnection)
   - Loss of connectivity
3. **NIDD**: Non-IP data routing to/from application servers
4. **Group Messaging**: Single API call to multiple UEs (via MBMS or unicast)
5. **API Exposure**: RESTful interface (T8) for SCS/AS integration

**T8 API Examples:**

```http
# Device Trigger Request
POST /scef/v1/trigger-delivery HTTP/1.1
Host: scef.operator.com
Content-Type: application/json
Authorization: Bearer <token>

{
  "externalId": "sensor-12345@iot.example.com",
  "validityPeriod": 3600,
  "priority": 1,
  "applicationPortId": 5000
}

# Monitoring Event Subscription (Location)
POST /scef/v1/monitoring/roaming-status HTTP/1.1
Host: scef.operator.com
Content-Type: application/json

{
  "externalIdentifier": "fleet-truck-789",
  "monitoringType": "LOCATION_REPORTING",
  "maximumNumberOfReports": 100,
  "monitorDuration": "2026-12-31T23:59:59Z",
  "notificationDestination": "https://app.example.com/events"
}

# NIDD Data Delivery
POST /scef/v1/nidd HTTP/1.1
Host: scef.operator.com
Content-Type: application/octet-stream

<binary data payload max 1600 bytes>
```

### NEF Functions (Release 15+)

**Enhanced Capabilities:**
1. **All SCEF functions** (backward compatible)
2. **Service-based exposure**: Unified Nnef interface
3. **Analytics exposure**: Integration with NWDAF for network insights
4. **Traffic influence**: Request specific routing/QoS for AF traffic
5. **PFD management**: Packet Flow Description for application detection
6. **AF session with QoS**: Dynamic QoS for application sessions
7. **Network slice exposure**: AF can request specific slice characteristics
8. **Chargeable party identification**: Sponsor connectivity charging

**Nnef Service Operations (TS 29.522):**

| Operation | Description | HTTP Method | Path |
|-----------|-------------|-------------|------|
| EventExposure_Subscribe | Subscribe to UE/network events | POST | /subscriptions |
| EventExposure_Notify | Receive event notifications | POST | {notifUri} |
| TrafficInfluence_Create | Request traffic routing influence | POST | /traffic-influences |
| PFDmanagement_Create | Manage PFD for application | POST | /pfd-management |
| AFsessionWithQoS_Create | Request QoS for AF session | POST | /af-sessions |
| NIDD_Config_Create | Configure NIDD | POST | /nidd-configurations |
| NIDD_Deliver | Deliver MT NIDD data | POST | /nidd/{configId}/deliver |

**NEF API Example (5G):**

```http
# Event Exposure Subscription
POST /nnef-eventexposure/v1/{apiInvokerId}/subscriptions HTTP/2
Host: nef.5gc.operator.com
Content-Type: application/json
Authorization: Bearer <OAuth2_token>

{
  "eventsSubs": [
    {
      "event": "UE_REACHABILITY_STATUS",
      "eventFilter": {
        "gpsi": ["msisdn-447700900123"],
        "reachabilityType": "DATA"
      }
    },
    {
      "event": "LOCATION_REPORTING",
      "eventFilter": {
        "externalId": "asset-tracker-456",
        "locationType": "CURRENT_LOCATION"
      }
    }
  ],
  "eventReq": {
    "immRep": false,
    "maxReports": 1000,
    "expiry": "2026-12-31T23:59:59Z"
  },
  "notificationDestination": "https://iot.example.com/notifications",
  "requestTestNotification": true
}

# Traffic Influence Request
POST /nnef-trafficinfluence/v1/{afId}/traffic-influences HTTP/2
Host: nef.5gc.operator.com
Content-Type: application/json

{
  "afAppId": "iot-app-video-stream",
  "trafficRoutes": [
    {
      "dnai": "edge-compute-london-1",
      "routeInfo": {
        "ipv4Addr": "192.168.100.50",
        "portNumber": 8080
      }
    }
  ],
  "validEndTime": "2026-04-15T18:00:00Z",
  "afTransId": "txn-12345"
}
```

---

## CIoT EPS Optimizations

See [diagrams/ciot-optimizations.md](diagrams/ciot-optimizations.md) for detailed flows and diagrams.

### Quick Reference

| Optimization | Data Path | Max Data Size | Signaling Messages | Best For |
|--------------|-----------|---------------|-------------------|----------|
| **CP CIoT** | Via NAS (control plane) | 1600 bytes | 6-8 | <200 bytes, infrequent |
| **UP CIoT** | Via S-GW/P-GW (user plane) | Standard MTU | 10-12 | 200-5000 bytes, moderate |
| **Standard** | Full EPS bearer | Unlimited | 20-30 | >5000 bytes, frequent |

### Power Savings Estimate

```
Scenario: 100 byte transmission, once per hour, 24/7

CP CIoT:
- Energy per tx: ~0.02 mAh
- Daily: 0.48 mAh
- Battery (3000 mAh): ~17 years

UP CIoT:
- Energy per tx: ~0.04 mAh
- Daily: 0.96 mAh
- Battery (3000 mAh): ~8.5 years

Standard LTE:
- Energy per tx: ~0.11 mAh
- Daily: 2.64 mAh
- Battery (3000 mAh): ~3.1 years
```

---

## Power Saving: eDRX & PSM

See [diagrams/edrx-psm.md](diagrams/edrx-psm.md) for detailed timing diagrams.

### Timer Quick Reference

**PSM Timers:**
- **T3324 (Active Timer)**: 2s - 186 minutes (how long UE stays reachable after transmission)
- **T3412 extended (TAU Timer)**: 10 minutes - 413 days (how long UE stays in PSM)

**eDRX Values:**
- **eDRX Cycle** (NB-IoT): 10.24s - 2916.48s (~48.6 minutes)
- **eDRX Cycle** (LTE-M): 5.12s - 2621.44s (~43.7 minutes)
- **PTW (Paging Time Window)**: 2.56s - 409.6s

### Configuration Decision Matrix

| Use Case | PSM T3324 | PSM T3412 | eDRX Cycle | eDRX PTW | Rationale |
|----------|-----------|-----------|------------|----------|-----------|
| **Smart Meter** | 30s | 24h | 655s | 5s | Rare MT, max battery |
| **Asset Tracker** | 10m | 4h | 82s | 10s | Frequent MT commands |
| **Wearable** | 5m | 2h | 20s | 8s | Low latency health alerts |
| **Environmental Sensor** | 60s | 7d | 1311s | 3s | Ultra-low power, static |

---

## SGP.32 eSIM for IoT

### Architecture Components

```
┌──────────────────────────────────────────────────────┐
│                 Subscription Manager                 │
│                                                      │
│  ┌─────────────────┐         ┌──────────────────┐  │
│  │     SM-DP+      │         │      SM-DS       │  │
│  │ (Data Prep &    │         │  (Discovery      │  │
│  │  Encryption)    │         │   Service)       │  │
│  └────────┬────────┘         └────────┬─────────┘  │
│           │                           │             │
└───────────┼───────────────────────────┼─────────────┘
            │ ES2+ / ES9+               │ ES12
            │                           │
            ▼                           ▼
┌─────────────────────────────────────────────────────┐
│              IoT Device with eUICC                  │
│                                                     │
│  ┌──────────────┐         ┌────────────────────┐  │
│  │     LPA      │◄───────►│       eUICC        │  │
│  │ (Local       │ ES10x   │ (Embedded UICC)    │  │
│  │  Profile     │         │                    │  │
│  │  Assistant)  │         │ ┌────────────────┐ │  │
│  └──────────────┘         │ │Bootstrap Profile│ │  │
│                           │ └────────────────┘ │  │
│                           │ ┌────────────────┐ │  │
│                           │ │Operational Prof│ │  │
│                           │ │   (MNO 1)      │ │  │
│                           │ └────────────────┘ │  │
│                           │ ┌────────────────┐ │  │
│                           │ │Operational Prof│ │  │
│                           │ │   (MNO 2)      │ │  │
│                           │ └────────────────┘ │  │
│                           └────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### SGP.32 Provisioning Flow

```
1. Manufacturing:
   ├─ eUICC installed with EID (eUICC Identifier)
   ├─ Bootstrap profile pre-loaded (limited connectivity)
   └─ PKI certificates provisioned

2. First Power-On:
   ├─ LPA activates bootstrap profile
   ├─ Device attaches to bootstrap network
   └─ Establishes data connection

3. Profile Discovery:
   ├─ LPA contacts SM-DS (discovery server)
   ├─ SM-DS checks for available profiles for this EID
   └─ Returns SM-DP+ address

4. Profile Download:
   ├─ LPA contacts SM-DP+ at provided address
   ├─ Mutual authentication (PKI-based)
   ├─ SM-DP+ generates and encrypts profile
   ├─ Profile downloaded to eUICC
   └─ eUICC decrypts and installs profile

5. Profile Activation:
   ├─ LPA instructs eUICC to switch to operational profile
   ├─ Bootstrap profile disabled
   ├─ Device re-attaches with operational credentials
   └─ Full service available

6. Ongoing Management:
   ├─ Profile updates via OTA
   ├─ Profile switching (if multiple MNOs)
   └─ Profile deletion and re-provisioning
```

### SGP.32 vs SGP.22 (Consumer eSIM)

| Feature | SGP.32 (IoT) | SGP.22 (Consumer) |
|---------|--------------|-------------------|
| **Target** | M2M, Industrial IoT | Smartphones, tablets |
| **Form Factor** | MFF2 (soldered chip) | Any (MFF2, integrated SoC) |
| **User Control** | None (remote management) | Full (user-initiated) |
| **Profile Switch** | Platform/network-initiated | User chooses via UI |
| **Provisioning** | Automated (SM-DS/SM-DP+) | QR code / app / operator website |
| **Use Case** | Fleet, meters, sensors | Personal devices, travel |
| **Activation** | Bootstrap → operational | Scan QR → download → activate |

---

## Device Management Integration

### OMA LwM2M over 3GPP

**Architecture:**

```
┌─────────────────────┐
│   IoT Device (UE)   │
│                     │
│  ┌───────────────┐  │
│  │  LwM2M Client │  │ LwM2M Protocol
│  │  (Objects:    │  │ (CoAP / UDP / SMS)
│  │   Device,     │  │
│  │   Firmware,   │  │
│  │   Connectivity│  │
│  │   Monitoring) │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │ 3GPP Bearer (NB-IoT / LTE-M / 5G)
           ▼
┌─────────────────────┐
│   3GPP Network      │
│   (EPC / 5GC)       │
│                     │
│  ┌───────────────┐  │
│  │  SCEF / NEF   │  │
│  │ (Device Trig) │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │ Internet / Private APN
           ▼
┌─────────────────────┐
│  LwM2M Bootstrap    │
│  Server             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  LwM2M Server       │
│  (Device Management,│
│   FOTA, Config)     │
└─────────────────────┘
```

**LwM2M Objects Relevant to 3GPP:**

| Object ID | Name | Purpose | 3GPP Mapping |
|-----------|------|---------|--------------|
| 0 | Security | Bootstrap credentials | EAP-AKA' for 5G |
| 1 | Server | LwM2M server info | SM-DP+ address (eSIM) |
| 3 | Device | Device metadata | IMEI, manufacturer |
| 4 | Connectivity Monitoring | Network stats | RSSI, cell ID, PLMN, RAT |
| 5 | Firmware Update | FOTA | Delivered via 3GPP bearer |
| 10 | Connectivity Statistics | Data usage | Bytes sent/received |
| 11 | APN Connection Profile | APN configuration | Maps to PDN/PDU session |

**Device Triggering Integration:**

```
Use Case: Wake sleeping IoT device for LwM2M bootstrap

1. LwM2M Bootstrap Server → Application Server
   Request: Trigger device with EID "iot-device-12345"

2. Application Server → SCEF/NEF (via T8/N33)
   API Call: Device Trigger (MSISDN or External ID)

3. SCEF/NEF → MME/AMF
   Trigger delivery via SMS or NAS signaling

4. Network → UE
   Device wakes from PSM, processes trigger

5. UE → LwM2M Bootstrap Server
   Initiates LwM2M bootstrap (CoAP over NB-IoT)

6. Bootstrap Server → UE
   Provides LwM2M server address and credentials

7. UE → LwM2M Server
   Registers and begins management session
```

**For comprehensive LwM2M expertise:**
→ [Best LwM2M Agentic Skills](https://github.com/svdwalt007/Best-LwM2M-Agentic-Skills)

---

## Cellular IoT vs Other LPWAN

### Technology Positioning

```
                    High Data Rate
                         ▲
                         │
                    ┌────┴────┐
                    │  5G NR  │
                    │ RedCap  │
                    └────┬────┘
                         │
                    ┌────┴────┐
                    │  LTE-M  │
                    └────┬────┘
                         │
         LoRaWAN    ┌────┴────┐    NB-IoT
         ◄──────────┤         ├──────────►
         (Unlicensed)│        │  (Licensed)
                    └────┬────┘
                         │
                    ┌────┴────┐
                    │ Sigfox  │
                    └─────────┘
                         │
                    Low Data Rate
                         ▼

                    ◄────────────────────►
                    Short     Coverage     Long
                    Range                  Range
```

### Detailed Comparison

| Feature | NB-IoT | LTE-M | LoRaWAN | Sigfox |
|---------|--------|-------|---------|--------|
| **Standardization** | 3GPP | 3GPP | LoRa Alliance | Sigfox proprietary |
| **Spectrum** | Licensed cellular | Licensed cellular | Unlicensed ISM | Unlicensed ISM |
| **Frequency Bands** | Operator-specific | Operator-specific | 868 MHz (EU), 915 MHz (US) | 868 MHz (EU), 902 MHz (US) |
| **Bandwidth** | 180 kHz | 1.4 MHz | 125/250/500 kHz | 100 Hz (UL), 1.5 kHz (DL) |
| **Peak Rate (UL)** | ~60 kbps | ~1 Mbps | 0.3-50 kbps | 100 bps |
| **Peak Rate (DL)** | ~30 kbps | ~1 Mbps | 0.3-50 kbps | 600 bps |
| **Range (urban)** | ~10 km | ~10 km | ~5 km | ~10 km |
| **Range (rural)** | ~40 km | ~40 km | ~15 km | ~40 km |
| **Latency** | 1-10s | 50-100ms | 1-10s | 2-6s |
| **Messages/Day** | Unlimited | Unlimited | Unlimited (fair use) | 140 UL, 4 DL |
| **Mobility** | Limited (handover) | Full (handover) | Limited (gateway-based) | Limited |
| **Authentication** | SIM-based (3GPP AKA) | SIM-based | AES-128 (app/network keys) | Proprietary |
| **Encryption** | End-to-end (IPsec, DTLS) | End-to-end | AES-128 | Proprietary |
| **QoS** | Carrier-grade | Carrier-grade | Best-effort | Best-effort |
| **Roaming** | Global (cellular) | Global (cellular) | Limited (peering) | Partner networks |
| **Network Ownership** | MNO | MNO | Private or public | Sigfox operator |
| **Deployment Cost** | Operator capex | Operator capex | Low (DIY gateways) | Service subscription |
| **Module Cost (2026)** | $2-4 | $4-8 | $3-6 | $2-5 |
| **Power Consumption** | ~10 years | ~10 years | ~10 years | ~10 years |
| **Positioning** | Cell-ID, enhanced | OTDOA, A-GPS | GPS add-on | GPS add-on |

### When to Choose Cellular IoT

**Choose NB-IoT/LTE-M when:**
- ✅ Global roaming required (fleet, logistics)
- ✅ SLA/QoS critical (utilities, healthcare)
- ✅ Regulatory compliance mandates (medical devices)
- ✅ Integration with existing cellular infrastructure
- ✅ Security is paramount (banking, access control)
- ✅ Mobility support needed (asset tracking)
- ✅ Operator-managed network preferred

**Choose LoRaWAN when:**
- ✅ Private network control desired
- ✅ Lower upfront network cost (DIY)
- ✅ Very low data rate acceptable (<10 kbps)
- ✅ Dense static sensor deployments (agriculture, buildings)
- ✅ No cellular coverage available (remote areas)

**Choose Sigfox when:**
- ✅ Extremely simple, low-cost deployment
- ✅ Very infrequent transmissions (<140/day)
- ✅ Sigfox coverage available in region
- ✅ No bidirectional communication needed

---

## Architecture Diagrams

Detailed architecture diagrams are available in the `diagrams/` folder:

1. **[nidd-lte-scef.md](diagrams/nidd-lte-scef.md)**: NIDD with LTE/EPC and SCEF
   - Mobile-originated NIDD flow
   - Mobile-terminated NIDD flow
   - Network architecture
   - Configuration examples

2. **[nidd-5g-nef.md](diagrams/nidd-5g-nef.md)**: NIDD with 5G and NEF
   - 5G NIDD PDU session establishment
   - MT data delivery via NEF
   - Service-based architecture
   - NEF API examples

3. **[ciot-optimizations.md](diagrams/ciot-optimizations.md)**: CIoT EPS Optimizations
   - CP CIoT message flow
   - UP CIoT suspend/resume flow
   - Power consumption comparison
   - Configuration requirements

4. **[edrx-psm.md](diagrams/edrx-psm.md)**: eDRX and PSM Power Saving
   - PSM state machine
   - eDRX timing diagrams
   - Combined PSM + eDRX operation
   - Configuration recommendations

---

## Key Specifications Quick Reference

### NB-IoT & LTE-M

| Spec | Title | Coverage |
|------|-------|----------|
| TS 36.211 | Physical channels and modulation | NB-IoT/LTE-M PHY |
| TS 36.212 | Multiplexing and channel coding | Encoding schemes |
| TS 36.213 | Physical layer procedures | Scheduling, HARQ |
| TS 36.321 | MAC protocol specification | MAC procedures |
| TS 36.322 | RLC protocol specification | RLC AM/UM/TM |
| TS 36.323 | PDCP protocol specification | PDCP security, compression |
| TS 36.331 | RRC protocol specification | RRC procedures, suspend/resume |

### NIDD & SCEF

| Spec | Title | Coverage |
|------|-------|----------|
| TS 23.682 | Architecture enhancements for service capability exposure | SCEF architecture, NIDD, monitoring |
| TS 29.336 | Home Subscriber Server (HSS) diameter interfaces (T6a/T6b) | SCEF-MME, SCEF-HSS interfaces |
| TS 29.128 | Tsp interface protocol (T8) | SCEF northbound API |

### 5G NEF & NIDD

| Spec | Title | Coverage |
|------|-------|----------|
| TS 23.501 | System architecture for the 5G System | NEF architecture, non-IP PDU sessions |
| TS 23.502 | Procedures for the 5G System | NIDD procedures, event exposure |
| TS 29.522 | 5G System; Network Exposure Function Northbound APIs | NEF Nnef service operations |
| TS 29.591 | 5G System; Network Exposure Function Southbound Services | Nnef service-based interface |

### CIoT Optimizations

| Spec | Title | Coverage |
|------|-------|----------|
| TS 23.401 | GPRS enhancements for E-UTRAN access | §5.3.4b CP CIoT, §5.3.4c UP CIoT |
| TS 24.301 | NAS protocol for EPS | ESM data transport for CP CIoT |
| TS 36.331 | RRC protocol specification | RRC suspend/resume (UP CIoT) |

### Power Saving

| Spec | Title | Coverage |
|------|-------|----------|
| TS 23.401 | GPRS enhancements for E-UTRAN access | §4.3.5.10 PSM, §5.3.4a eDRX |
| TS 24.008 | Mobile radio interface Layer 3 specification | §10.5.5.6 T3324, §10.5.5.32 T3412 ext |
| TS 24.301 | NAS protocol for EPS | §9.9.3.10A eDRX parameters IE |

### eSIM (SGP.32)

| Spec | Title | Organization |
|------|-------|--------------|
| SGP.32 v3.0 | Remote SIM Provisioning for IoT | GSMA |
| SGP.02 v4.3 | Remote Provisioning Architecture for Embedded UICC | GSMA (legacy) |
| TS 31.102 | USIM application characteristics | 3GPP |
| TS 33.501 | Security architecture and procedures for 5G System | 3GPP (§6.2.5 eSIM auth) |

### RedCap

| Spec | Title | Coverage |
|------|-------|----------|
| TS 38.306 | User Equipment (UE) radio access capabilities | RedCap UE categories |
| TS 38.331 | NR RRC protocol specification | RedCap-specific procedures |
| TS 22.261 | Service requirements for 5G system | §6.43 Reduced capability NR devices |

---

## Related Resources

For comprehensive coverage of complementary IoT technologies:

- **[Best LwM2M Agentic Skills](https://github.com/svdwalt007/Best-LwM2M-Agentic-Skills)**: Deep expertise in OMA LwM2M device management protocol, bootstrap, objects, FOTA
- **[Best IoT Protocols Skills](https://github.com/svdwalt007/Best-IoT-Protocols-Skills)**: Covers 15+ protocol domains including MQTT, CoAP, LoRaWAN, OPC UA, DLMS/COSEM, and more

---

*Last Updated: 2026-04-15*
*3GPP Release Coverage: Up to Release 19*
