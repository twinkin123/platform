"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const CLIP_LIB = "/anims/UAL1_Standard.glb";
const PLAYER_RIG = "/characters/a.gltf";
const NPC_RIG = "/characters/b.gltf";
const KIT = "/kits/buildings/fbx/";

const SHOPS = [
  "2Story_Balcony", "2Story_Sign", "1Story_Sign", "2Story_Columns",
  "1Story", "2Story", "2Story_Double", "1Story_GableRoof",
  "2Story_Center", "2Story_Sidehouse", "1Story_RoundRoof", "2Story_2",
];

type Collider = { x: number; z: number; w: number; d: number };

export default function Town() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#dfeef8", 26, 95);

    const cam = new THREE.PerspectiveCamera(52, 1, 0.1, 300);

    const grad = (() => {
      const d = new Uint8Array([26, 96, 180, 240, 255]);
      const t = new THREE.DataTexture(d, 5, 1, THREE.RedFormat);
      t.needsUpdate = true;
      return t;
    })();

    const tex = (draw: (c: CanvasRenderingContext2D) => void, rep = 1) => {
      const cv = document.createElement("canvas");
      cv.width = 256;
      cv.height = 256;
      draw(cv.getContext("2d")!);
      const t = new THREE.CanvasTexture(cv);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rep, rep);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };

    const skyTex = tex((c) => {
      const g = c.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, "#1d84d4");
      g.addColorStop(0.5, "#6cc3ee");
      g.addColorStop(1, "#e4f4fc");
      c.fillStyle = g;
      c.fillRect(0, 0, 256, 256);
    });
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(160, 24, 16),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false })
    );
    scene.add(sky);

    scene.add(new THREE.HemisphereLight("#cde9ff", "#6d7558", 0.55));
    const sun = new THREE.DirectionalLight("#ffeac2", 1.95);
    sun.position.set(14, 20, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    sun.shadow.bias = -0.0007;
    scene.add(sun);
    const rim = new THREE.DirectionalLight("#a4d8ff", 0.7);
    rim.position.set(-16, 10, -14);
    scene.add(rim);

    const cobble = tex((c) => {
      c.fillStyle = "#6b6458";
      c.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const g = 142 + Math.floor(Math.random() * 22);
          c.fillStyle = `rgb(${g},${g - 9},${g - 24})`;
          c.beginPath();
          c.roundRect(x * 32 + 2, y * 32 + 2, 28, 28, 7);
          c.fill();
          c.fillStyle = "rgba(255,255,255,0.12)";
          c.beginPath();
          c.roundRect(x * 32 + 4, y * 32 + 4, 24, 7, 4);
          c.fill();
        }
      }
    }, 60);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshToonMaterial({ map: cobble, gradientMap: grad }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const cloud = (x: number, y: number, z: number, s: number) => {
      const g = new THREE.Group();
      for (let i = 0; i < 6; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(1.9 + Math.random() * 1.7, 12, 10), new THREE.MeshToonMaterial({ color: "#ffffff", gradientMap: grad }));
        p.position.set((i - 2.5) * 2.3, Math.random() * 1.1, Math.random() * 1.4);
        p.scale.y = 0.66;
        g.add(p);
      }
      g.position.set(x, y, z);
      g.scale.setScalar(s);
      scene.add(g);
    };
    cloud(-30, 24, -46, 1.6);
    cloud(8, 30, -60, 2.1);
    cloud(34, 22, -40, 1.3);

    const colliders: Collider[] = [];

    const toonify = (root: THREE.Object3D) => {
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const old = m.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
        const one = Array.isArray(old) ? old[0] : old;
        m.material = new THREE.MeshToonMaterial({
          color: one?.color ? one.color.clone() : new THREE.Color("#ffffff"),
          map: one?.map ?? null,
          gradientMap: grad,
        });
        m.castShadow = true;
        m.receiveShadow = true;
      });
    };

    const fbx = new FBXLoader();
    fbx.setResourcePath("/kits/buildings/textures/");
    fbx.setPath(KIT);

    const tl = new THREE.TextureLoader();
    const PALETTE = ["Light2", "Light", "Blue", "Yellow", "Light2", "Green", "Red", "Blue", "Light", "Yellow", "Green", "Light2"];
    const atlas = new Map<string, THREE.Texture>();
    PALETTE.forEach((n) => {
      const t = tl.load(`/kits/buildings/textures/Texture_${n}.png`);
      t.colorSpace = THREE.SRGBColorSpace;
      atlas.set(n, t);
    });

    const dress = (root: THREE.Object3D, name: string) => {
      const map = atlas.get(name) ?? null;
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.material = new THREE.MeshToonMaterial({ map, color: 0xffffff, gradientMap: grad });
        m.castShadow = true;
        m.receiveShadow = true;
      });
    };

    const buildRoom = (x: number, z: number) => {
      const g = new THREE.Group();
      const wall = new THREE.MeshToonMaterial({ color: "#e8dcc4", gradientMap: grad });
      const floorMat = new THREE.MeshToonMaterial({ color: "#8a6a45", gradientMap: grad });

      const f = new THREE.Mesh(new THREE.BoxGeometry(8, 0.16, 8), floorMat);
      f.position.y = 0.08;
      f.receiveShadow = true;
      g.add(f);

      const ceil = new THREE.Mesh(new THREE.BoxGeometry(8, 0.16, 8), wall);
      ceil.position.y = 3.1;
      g.add(ceil);

      const back = new THREE.Mesh(new THREE.BoxGeometry(8, 3.2, 0.2), wall);
      back.position.set(0, 1.6, -4);
      back.receiveShadow = true;
      g.add(back);

      for (const dx of [-4, 4]) {
        const side = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 8), wall);
        side.position.set(dx, 1.6, 0);
        side.receiveShadow = true;
        g.add(side);
      }

      const counter = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.05, 0.9), new THREE.MeshToonMaterial({ color: "#a4693f", gradientMap: grad }));
      counter.position.set(1.4, 0.52, -1.6);
      counter.castShadow = true;
      g.add(counter);

      for (let i = 0; i < 4; i++) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.5), new THREE.MeshToonMaterial({ color: "#8d5f38", gradientMap: grad }));
        shelf.position.set(-2.2, 0.8 + i * 0.62, -3.6);
        g.add(shelf);
        for (let j = 0; j < 3; j++) {
          const item = new THREE.Mesh(
            new THREE.BoxGeometry(0.28, 0.34, 0.28),
            new THREE.MeshToonMaterial({ color: ["#e2564f", "#2f8fbf", "#e8b93f"][j], gradientMap: grad })
          );
          item.position.set(-3 + j * 0.72, 1.05 + i * 0.62, -3.6);
          g.add(item);
        }
      }

      const lamp = new THREE.PointLight("#ffd9a0", 16, 12, 2);
      lamp.position.set(0, 2.7, 0);
      g.add(lamp);

      g.position.set(x, 0, z);
      scene.add(g);
    };

    const placeShop = (name: string, x: number, z: number, face: number, targetH: number) => {
      fbx.load(
        `${name}.fbx`,
        (obj) => {
          const raw = new THREE.Box3().setFromObject(obj);
          const rawSize = raw.getSize(new THREE.Vector3());
          const s = targetH / Math.max(rawSize.y, 0.001);
          obj.scale.setScalar(s);

          const bb = new THREE.Box3().setFromObject(obj);
          const size = bb.getSize(new THREE.Vector3());
          const w = Math.max(size.x, 3.4);
          const d = Math.max(size.z, 3.4);

          obj.position.set(x, -bb.min.y, z);
          obj.rotation.y = face;
          dress(obj, "Light2");

          scene.add(obj);

          const doorHalf = 1.15;
          const leftW = Math.max(w / 2 - doorHalf, 0.4);
          colliders.push({ x: x - doorHalf - leftW / 2, z, w: leftW, d });
          colliders.push({ x: x + doorHalf + leftW / 2, z, w: leftW, d });
        },
        undefined,
        (err) => console.warn("fbx failed", name, err)
      );
    };

    let cursor = -30;
    const northZ = -12;
    const southZ = 12;

    SHOPS.forEach((name, i) => {
      const w = 7;
      const north = i % 2 === 0;
      const x = cursor + w / 2;
      const tall = name.startsWith("2Story") ? 8.4 : 4.6;
      placeShop(name, x, north ? northZ : southZ, north ? 0 : Math.PI, tall);
      buildRoom(x, north ? northZ - 6.4 : southZ + 6.4);
      cursor += w + 0.6;
    });

    const casino = new THREE.Group();
    const diceMat = new THREE.MeshToonMaterial({ color: "#ffffff", gradientMap: grad });
    for (const [dx, s] of [[-1.4, 1.5], [1.6, 1.1]] as [number, number][]) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), diceMat);
      d.position.set(dx, 9.4, 0);
      d.rotation.set(0.3, 0.6, 0.1);
      d.castShadow = true;
      casino.add(d);
    }
    casino.position.set(0, 0, -24);
    scene.add(casino);

    const propMat = (col: number) => new THREE.MeshToonMaterial({ color: col, gradientMap: grad });

    const lamp = (x: number, z: number) => {
      const g = new THREE.Group();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 4.2, 10), propMat(0x2b2b33));
      post.position.y = 2.1;
      post.castShadow = true;
      g.add(post);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.1), propMat(0x2b2b33));
      arm.position.set(0.3, 4.1, 0);
      g.add(arm);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), new THREE.MeshBasicMaterial({ color: "#ffe9b0" }));
      head.position.set(0.62, 3.98, 0);
      g.add(head);
      const halo = new THREE.PointLight("#ffd9a0", 9, 9, 2);
      halo.position.set(0.62, 3.9, 0);
      g.add(halo);
      g.position.set(x, 0, z);
      scene.add(g);
      colliders.push({ x, z, w: 0.4, d: 0.4 });
    };

    const planter = (x: number, z: number) => {
      const g = new THREE.Group();
      const pot = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 0.9), propMat(0x9c6b3c));
      pot.position.y = 0.35;
      pot.castShadow = true;
      g.add(pot);
      for (let i = 0; i < 5; i++) {
        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), propMat(0x3f8f52));
        bush.position.set(-0.6 + i * 0.3, 0.85, (Math.random() - 0.5) * 0.4);
        bush.castShadow = true;
        g.add(bush);
      }
      g.position.set(x, 0, z);
      scene.add(g);
      colliders.push({ x, z, w: 1.5, d: 0.9 });
    };

    const crate = (x: number, z: number, s: number, ry: number) => {
      const g = new THREE.Group();
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), propMat(0xc08b52));
      b.castShadow = true;
      g.add(b);
      for (const o of [-0.4, 0.4]) {
        const sl = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.13, 0.13), propMat(0x9c6b3c));
        sl.position.set(0, o, 0.56);
        g.add(sl);
      }
      g.position.set(x, s * 0.56, z);
      g.scale.setScalar(s);
      g.rotation.y = ry;
      scene.add(g);
      colliders.push({ x, z, w: 1.1 * s, d: 1.1 * s });
    };

    const bench = (x: number, z: number, ry: number) => {
      const g = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 0.7), propMat(0xa07a4e));
      seat.position.y = 0.55;
      seat.castShadow = true;
      g.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 0.12), propMat(0xa07a4e));
      back.position.set(0, 0.95, -0.28);
      g.add(back);
      for (const dx of [-0.9, 0.9]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.6), propMat(0x2b2b33));
        leg.position.set(dx, 0.27, 0);
        g.add(leg);
      }
      g.position.set(x, 0, z);
      g.rotation.y = ry;
      scene.add(g);
      colliders.push({ x, z, w: 2.4, d: 0.8 });
    };

    for (let x = -26; x <= 30; x += 9) {
      lamp(x, -7.2);
      lamp(x + 4.5, 7.2);
    }
    planter(-14, -6.9);
    planter(-4, 6.9);
    planter(8, -6.9);
    planter(18, 6.9);
    crate(-21, 6.4, 1, 0.3);
    crate(-20, 7.2, 0.8, -0.4);
    crate(23, -6.4, 1.1, 0.5);
    crate(24.2, -7.1, 0.75, 0.1);
    bench(-10, 7.6, Math.PI);
    bench(14, -7.6, 0);

    const end = new THREE.Group();
    const facadeTex = atlas.get("Casino") ?? null;
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(26, 9, 12),
      new THREE.MeshToonMaterial({ map: facadeTex, color: 0xffffff, gradientMap: grad })
    );
    block.position.y = 4.5;
    block.castShadow = true;
    block.receiveShadow = true;
    end.add(block);
    for (const [dx, s] of [[-2.4, 2], [2.6, 1.5]] as [number, number][]) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), new THREE.MeshToonMaterial({ color: "#ffffff", gradientMap: grad }));
      d.position.set(dx, 10.6, 0);
      d.rotation.set(0.3, 0.5, 0.1);
      d.castShadow = true;
      end.add(d);
    }
    const signCv = document.createElement("canvas");
    signCv.width = 512;
    signCv.height = 128;
    const sc = signCv.getContext("2d")!;
    sc.fillStyle = "#7d1620";
    sc.fillRect(0, 0, 512, 128);
    sc.strokeStyle = "#ffd77a";
    sc.lineWidth = 8;
    sc.strokeRect(6, 6, 500, 116);
    sc.fillStyle = "#ffe08a";
    sc.font = "bold 72px sans-serif";
    sc.textAlign = "center";
    sc.textBaseline = "middle";
    sc.fillText("CASINO", 256, 68);
    const signTex = new THREE.CanvasTexture(signCv);
    signTex.colorSpace = THREE.SRGBColorSpace;
    const signPlane = new THREE.Mesh(new THREE.PlaneGeometry(11, 2.75), new THREE.MeshBasicMaterial({ map: signTex }));
    signPlane.position.set(0, 8.4, 6.06);
    end.add(signPlane);
    end.position.set(0, 0, -16);
    scene.add(end);
    colliders.push({ x: 0, z: -16, w: 26, d: 12 });

    const keys = new Set<string>();
    const moveKeys = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
    const down = (e: KeyboardEvent) => {
      if (moveKeys.includes(e.key.toLowerCase())) keys.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    const player = new THREE.Group();
    player.position.set(0, 0, 0);
    scene.add(player);

    const rigGroup = new THREE.Group();
    player.add(rigGroup);

    const stub = new THREE.Group();
    const stubBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.3, 0.62, 6, 12),
      new THREE.MeshToonMaterial({ color: 0x7c5cff, gradientMap: grad })
    );
    stubBody.position.y = 1.05;
    stubBody.castShadow = true;
    stub.add(stubBody);
    const stubHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 12),
      new THREE.MeshToonMaterial({ color: 0xf0c19b, gradientMap: grad })
    );
    stubHead.position.y = 1.66;
    stubHead.castShadow = true;
    stub.add(stubHead);
    rigGroup.add(stub);

    let mixer: THREE.AnimationMixer | null = null;
    let idleAction: THREE.AnimationAction | null = null;
    let jogAction: THREE.AnimationAction | null = null;
    let moving = false;
    let ready = false;
    let bones: Record<string, THREE.Object3D> = {};

    const retargetClip = (clip: THREE.AnimationClip) => {
      clip.tracks.forEach((tr) => {
        const dot = tr.name.lastIndexOf(".");
        const prop = tr.name.slice(dot + 1);
        let node = tr.name.slice(0, dot);
        const bracket = node.match(/\[([^\]]+)\]/);
        if (bracket) node = bracket[1];
        else node = node.split("|").pop()!.split(":").pop()!;
        tr.name = node + "." + prop;
      });
      return clip;
    };

    const gltf = new GLTFLoader();
    gltf.load(
      PLAYER_RIG,
      (g) => {
        const m = g.scene;
        m.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            const old = mesh.material as THREE.MeshStandardMaterial;
            mesh.material = new THREE.MeshToonMaterial({
              color: old.color ?? new THREE.Color("#ffffff"),
              map: old.map ?? null,
              gradientMap: grad,
            });
          }
        });
        rigGroup.remove(stub);
        rigGroup.add(m);
        ["upperarm_l", "upperarm_r", "lowerarm_l", "lowerarm_r", "thigh_l", "thigh_r", "calf_l", "calf_r", "spine_02"].forEach((n) => {
          const b = m.getObjectByName(n);
          if (b) bones[n] = b;
        });

        const bbH = new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3()).y;
        const k = bbH > 0.1 ? bbH / 1.8 : 1;

        const fit = (bone: string, geo: THREE.BufferGeometry, color: number, y: number) => {
          const b = m.getObjectByName(bone);
          if (!b) return;
          const piece = new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color, gradientMap: grad }));
          piece.position.y = y * k;
          piece.castShadow = true;
          b.add(piece);
        };
        fit("spine_02", new THREE.CapsuleGeometry(0.19 * k, 0.3 * k, 6, 12), 0x7c5cff, 0.04);
        fit("spine_01", new THREE.CapsuleGeometry(0.18 * k, 0.1 * k, 6, 12), 0x6a4ae8, 0);
        fit("upperarm_l", new THREE.CapsuleGeometry(0.098 * k, 0.26 * k, 5, 10), 0x7c5cff, -0.05);
        fit("upperarm_r", new THREE.CapsuleGeometry(0.098 * k, 0.26 * k, 5, 10), 0x7c5cff, -0.05);
        fit("lowerarm_l", new THREE.CapsuleGeometry(0.088 * k, 0.2 * k, 5, 10), 0x7c5cff, -0.04);
        fit("lowerarm_r", new THREE.CapsuleGeometry(0.088 * k, 0.2 * k, 5, 10), 0x7c5cff, -0.04);
        fit("pelvis", new THREE.CapsuleGeometry(0.19 * k, 0.1 * k, 6, 12), 0x2f2a44, 0);
        fit("thigh_l", new THREE.CapsuleGeometry(0.1 * k, 0.26 * k, 5, 10), 0x3a3a4a, -0.1);
        fit("thigh_r", new THREE.CapsuleGeometry(0.1 * k, 0.26 * k, 5, 10), 0x3a3a4a, -0.1);
        fit("calf_l", new THREE.CapsuleGeometry(0.085 * k, 0.2 * k, 5, 10), 0x3a3a4a, -0.08);
        fit("calf_r", new THREE.CapsuleGeometry(0.085 * k, 0.2 * k, 5, 10), 0x3a3a4a, -0.08);
        fit("foot_l", new THREE.BoxGeometry(0.18 * k, 0.13 * k, 0.3 * k), 0x1c1c24, -0.01);
        fit("foot_r", new THREE.BoxGeometry(0.18 * k, 0.13 * k, 0.3 * k), 0x1c1c24, -0.01);
        fit("Head", new THREE.SphereGeometry(0.21 * k, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), 0x2f2a44, 0.1);

        const lib = new GLTFLoader();
        lib.load(CLIP_LIB, (lg) => {
          mixer = new THREE.AnimationMixer(m);
          const idle = lg.animations.find((c) => c.name === "Idle_Loop");
          const jog = lg.animations.find((c) => c.name === "Jog_Fwd_Loop");
          if (idle) idleAction = mixer.clipAction(retargetClip(idle));
          if (jog) jogAction = mixer.clipAction(retargetClip(jog));
          console.log("track", lg.animations[0]?.tracks[0]?.name, lg.animations[0]?.tracks.length);
          ready = true;
        });
      },
      undefined,
      (err) => console.warn("rig failed", err)
    );

    const npcs: { g: THREE.Group; mixer: THREE.AnimationMixer | null; dir: number }[] = [];
    [-8, 9].forEach((x, i) => {
      const g = new THREE.Group();
      g.position.set(x, 0, 2);
      scene.add(g);
      const entry = { g, mixer: null as THREE.AnimationMixer | null, dir: i === 0 ? 1 : -1, bones: {} as Record<string, THREE.Object3D> };
      npcs.push(entry);
      gltf.load(NPC_RIG, (ng) => {
        const m = ng.scene;
        m.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) mesh.castShadow = true;
        });
        g.add(m);
        ["upperarm_l", "upperarm_r", "lowerarm_l", "lowerarm_r", "thigh_l", "thigh_r", "calf_l", "calf_r", "spine_02", "pelvis", "foot_l", "foot_r", "Head"].forEach((n) => {
          const b = m.getObjectByName(n);
          if (b) entry.bones[n] = b;
        });
        const nk = 1;
        const npcPiece = (bone: string, geo: THREE.BufferGeometry, col: number, y: number) => {
          const b = entry.bones[bone];
          if (!b) return;
          const pc = new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color: col, gradientMap: grad }));
          pc.position.y = y;
          pc.castShadow = true;
          b.add(pc);
        };
        npcPiece("spine_02", new THREE.CapsuleGeometry(0.19 * nk, 0.3 * nk, 6, 12), i === 0 ? 0xff8a3d : 0x35c08a, 0.04);
        npcPiece("upperarm_l", new THREE.CapsuleGeometry(0.098 * nk, 0.26 * nk, 5, 10), i === 0 ? 0xff8a3d : 0x35c08a, -0.05);
        npcPiece("upperarm_r", new THREE.CapsuleGeometry(0.098 * nk, 0.26 * nk, 5, 10), i === 0 ? 0xff8a3d : 0x35c08a, -0.05);
        npcPiece("lowerarm_l", new THREE.CapsuleGeometry(0.088 * nk, 0.2 * nk, 5, 10), i === 0 ? 0xff8a3d : 0x35c08a, -0.04);
        npcPiece("lowerarm_r", new THREE.CapsuleGeometry(0.088 * nk, 0.2 * nk, 5, 10), i === 0 ? 0xff8a3d : 0x35c08a, -0.04);
        npcPiece("pelvis", new THREE.CapsuleGeometry(0.19 * nk, 0.1 * nk, 6, 12), 0x2f2a44, 0);
        npcPiece("thigh_l", new THREE.CapsuleGeometry(0.1 * nk, 0.26 * nk, 5, 10), 0x3a3a4a, -0.1);
        npcPiece("thigh_r", new THREE.CapsuleGeometry(0.1 * nk, 0.26 * nk, 5, 10), 0x3a3a4a, -0.1);
        npcPiece("calf_l", new THREE.CapsuleGeometry(0.085 * nk, 0.2 * nk, 5, 10), 0x3a3a4a, -0.08);
        npcPiece("calf_r", new THREE.CapsuleGeometry(0.085 * nk, 0.2 * nk, 5, 10), 0x3a3a4a, -0.08);
        npcPiece("foot_l", new THREE.BoxGeometry(0.18, 0.13, 0.3), 0x1c1c24, -0.01);
        npcPiece("foot_r", new THREE.BoxGeometry(0.18, 0.13, 0.3), 0x1c1c24, -0.01);
        const lib = new GLTFLoader();
        lib.load(CLIP_LIB, (lg) => {
          const c = lg.animations.find((a) => a.name === "Jog_Fwd_Loop");
          if (!c) return;
          const mx = new THREE.AnimationMixer(m);
          mx.clipAction(retargetClip(c)).play();
          entry.mixer = mx;
        });
      });
    });

    const resize = () => {
      cam.aspect = el.clientWidth / el.clientHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let raf = 0;
    const camPos = new THREE.Vector3(0, 4.2, 10);

    const blocked = (x: number, z: number) => {
      const r = 0.42;
      return colliders.some((c) => Math.abs(x - c.x) < c.w / 2 + r && Math.abs(z - c.z) < c.d / 2 + r);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);

      let mx = 0;
      let mz = 0;
      if (keys.has("w") || keys.has("arrowup")) mz -= 1;
      if (keys.has("s") || keys.has("arrowdown")) mz += 1;
      if (keys.has("a") || keys.has("arrowleft")) mx -= 1;
      if (keys.has("d") || keys.has("arrowright")) mx += 1;
      const len = Math.hypot(mx, mz) || 1;
      moving = mx !== 0 || mz !== 0;

      if (moving) {
        const sp = 5.4;
        const nx = THREE.MathUtils.clamp(player.position.x + (mx / len) * sp * dt, -42, 42);
        const nz = THREE.MathUtils.clamp(player.position.z + (mz / len) * sp * dt, -22, 30);
        if (!blocked(nx, player.position.z)) player.position.x = nx;
        if (!blocked(player.position.x, nz)) player.position.z = nz;
        const target = Math.atan2(mx, mz);
        player.rotation.y += THREE.MathUtils.lerp(0, ((target - player.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI, 0.22);
      }

      const et = clock.elapsedTime;
      const sw = Math.sin(et * (moving ? 9 : 1.6));
      const amp = moving ? 0.8 : 0.09;
      if (bones.upperarm_l) { bones.upperarm_l.rotation.z = -1.2; bones.upperarm_l.rotation.x = sw * amp; }
      if (bones.upperarm_r) { bones.upperarm_r.rotation.z = 1.2; bones.upperarm_r.rotation.x = -sw * amp; }
      if (bones.lowerarm_l) bones.lowerarm_l.rotation.x = moving ? 0.5 : 0.12;
      if (bones.lowerarm_r) bones.lowerarm_r.rotation.x = moving ? 0.5 : 0.12;
      if (bones.thigh_l) bones.thigh_l.rotation.x = -sw * amp * 0.85;
      if (bones.thigh_r) bones.thigh_r.rotation.x = sw * amp * 0.85;
      if (bones.calf_l) bones.calf_l.rotation.x = Math.max(0, sw) * (moving ? 0.6 : 0.05);
      if (bones.calf_r) bones.calf_r.rotation.x = Math.max(0, -sw) * (moving ? 0.6 : 0.05);
      if (bones.spine_02) bones.spine_02.rotation.z = sw * (moving ? 0.05 : 0.02);

      npcs.forEach((n) => {
        n.g.position.x += n.dir * 1.7 * dt;
        if (n.g.position.x > 26) n.dir = -1;
        if (n.g.position.x < -26) n.dir = 1;
        n.g.rotation.y = n.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
        const psw = Math.sin(et * 8 + n.g.position.x);
        if (n.bones.upperarm_l) { n.bones.upperarm_l.rotation.z = -1.2; n.bones.upperarm_l.rotation.x = psw * 0.8; }
        if (n.bones.upperarm_r) { n.bones.upperarm_r.rotation.z = 1.2; n.bones.upperarm_r.rotation.x = -psw * 0.8; }
        if (n.bones.thigh_l) n.bones.thigh_l.rotation.x = -psw * 0.7;
        if (n.bones.thigh_r) n.bones.thigh_r.rotation.x = psw * 0.7;
        if (n.bones.calf_l) n.bones.calf_l.rotation.x = Math.max(0, psw) * 0.5;
        if (n.bones.calf_r) n.bones.calf_r.rotation.x = Math.max(0, -psw) * 0.5;
      });

      const back = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation.y);
      let dist = 8.6;
      for (let d = 8.6; d > 2.4; d -= 0.4) {
        const cx = player.position.x - back.x * d;
        const cz = player.position.z - back.z * d;
        if (!blocked(cx, cz)) { dist = d; break; }
      }
      camPos.lerp(
        new THREE.Vector3(player.position.x - back.x * dist, 3.7, player.position.z - back.z * dist),
        0.12
      );
      cam.position.copy(camPos);
      cam.lookAt(player.position.x, 1.3, player.position.z);
      sky.position.copy(cam.position);

      renderer.render(scene, cam);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} className="absolute inset-0" />;
}