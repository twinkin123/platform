"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function VilleScene() {
  const mount = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState("0, 0");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0d1b30");
    scene.fog = new THREE.Fog("#0d1b30", 40, 120);

    const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 340);
    let theta = -0.5, rad = 30, phi = 0.8;
    const place = () => {
      cam.position.set(Math.cos(theta) * rad, Math.sin(phi) * rad, Math.sin(theta) * rad);
      cam.lookAt(0, 2.4, 0);
    };
    place();

    scene.add(new THREE.HemisphereLight("#9fc0ff", "#1a2436", 0.75));
    const moon = new THREE.DirectionalLight("#cfe2ff", 1.25);
    moon.position.set(-18, 28, 14);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    const sc = moon.shadow.camera;
    sc.left = -42; sc.right = 42; sc.top = 42; sc.bottom = -42; sc.near = 1; sc.far = 95;
    scene.add(moon);
    const warm = new THREE.PointLight("#ffbe66", 4.5, 30, 2);
    warm.position.set(0, 6, -10);
    scene.add(warm);

    const toon = (c: string) => new THREE.MeshToonMaterial({ color: c });

    const tex = (draw: (x: CanvasRenderingContext2D, w: number, h: number) => void) => {
      const c = document.createElement("canvas");
      c.width = 128; c.height = 128;
      draw(c.getContext("2d")!, 128, 128);
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    };

    const snowTex = tex((x, w, h) => {
      x.fillStyle = "#eaf0f9"; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 240; i++) {
        x.fillStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.6})`;
        x.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
    });
    snowTex.repeat.set(16, 16);
    const cobbleTex = tex((x, w, h) => {
      x.fillStyle = "#cfd9e7"; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 70; i++) {
        x.fillStyle = `rgba(150,164,186,${0.2 + Math.random() * 0.35})`;
        x.beginPath();
        x.ellipse(Math.random() * w, Math.random() * h, 6 + Math.random() * 9, 4 + Math.random() * 6, Math.random() * 3, 0, 6.3);
        x.fill();
      }
    });
    cobbleTex.repeat.set(5, 5);

    const ground = new THREE.Mesh(new THREE.CircleGeometry(72, 72), new THREE.MeshToonMaterial({ color: "#f0f5fb", map: snowTex }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const plaza = new THREE.Mesh(new THREE.CircleGeometry(12.5, 60), new THREE.MeshToonMaterial({ color: "#d2dceb", map: cobbleTex }));
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.02;
    plaza.receiveShadow = true;
    scene.add(plaza);

    // casino
    const casino = new THREE.Group();
    casino.position.set(0, 0, -18);
    scene.add(casino);
    const body = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 10), toon("#3a4c66"));
    body.position.y = 4.5;
    body.castShadow = body.receiveShadow = true;
    casino.add(body);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(18.8, 0.6, 10.6), toon("#cfdaea"));
    trim.position.y = 9.1;
    casino.add(trim);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(10.6, 10.6, 9.4, 3), toon("#44586f"));
    ped.rotation.set(Math.PI / 2, 0, Math.PI / 6);
    ped.scale.set(1, 1, 0.15);
    ped.position.set(0, 11.8, 0);
    ped.castShadow = true;
    casino.add(ped);
    for (let i = 0; i < 6; i++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.58, 8, 16), toon("#e2ebf7"));
      col.position.set(-7.2 + i * 2.88, 4, 5.45);
      col.castShadow = true;
      casino.add(col);
    }
    const signCanvas = document.createElement("canvas");
    signCanvas.width = 512; signCanvas.height = 128;
    const sx = signCanvas.getContext("2d")!;
    sx.fillStyle = "#0a0f1a"; sx.fillRect(0, 0, 512, 128);
    sx.font = "800 72px Inter, sans-serif";
    sx.textAlign = "center";
    sx.textBaseline = "middle";
    sx.fillStyle = "#ffeaa9";
    sx.shadowColor = "#ffcf5a";
    sx.shadowBlur = 28;
    sx.fillText("CASINO", 256, 68);
    const signTex = new THREE.CanvasTexture(signCanvas);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.2), new THREE.MeshBasicMaterial({ map: signTex, transparent: true }));
    sign.position.set(0, 10.1, 5.6);
    casino.add(sign);
    const signLight = new THREE.PointLight("#ffcf5a", 3, 18, 2);
    signLight.position.set(0, 10, 6.6);
    casino.add(signLight);
    const door = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.6, 0.3), new THREE.MeshBasicMaterial({ color: "#ffdd96" }));
    door.position.set(0, 2.3, 5.4);
    casino.add(door);

    // fountain
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.9, 0.7, 24), toon("#c8d3e2"));
    basin.position.y = 0.35;
    basin.castShadow = basin.receiveShadow = true;
    scene.add(basin);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.5, 2.2, 14), toon("#c8d3e2"));
    stem.position.y = 1.5;
    scene.add(stem);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.5, 0.4, 18), toon("#c8d3e2"));
    bowl.position.y = 2.6;
    scene.add(bowl);

    const SP = 140;
    const spPos = new Float32Array(SP * 3);
    const spVel: number[][] = [];
    for (let i = 0; i < SP; i++) {
      spPos[i * 3] = (Math.random() - 0.5) * 0.5;
      spPos[i * 3 + 1] = 2.9;
      spPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      spVel.push([(Math.random() - 0.5) * 0.06, Math.random() * 0.09 + 0.05, (Math.random() - 0.5) * 0.06]);
    }
    const spGeo = new THREE.BufferGeometry();
    spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
    scene.add(new THREE.Points(spGeo, new THREE.PointsMaterial({ color: "#bfe4ff", size: 0.12, transparent: true, opacity: 0.9 })));

    // houses
    const houses: { x: number; z: number; w: number; h: number; d: number; c: string; roof: string; n: string }[] = [
      { x: -20, z: -5, w: 6, h: 4, d: 6, c: "#455a76", roof: "#8d3f3f", n: "Trade Hall" },
      { x: -26, z: 5, w: 6, h: 3.6, d: 6, c: "#4e617c", roof: "#7d3a3a", n: "Bank" },
      { x: 20, z: -5, w: 6, h: 4.4, d: 6, c: "#3b4d66", roof: "#8d3f3f", n: "Forge" },
      { x: -16, z: 13, w: 5.4, h: 3.4, d: 5.4, c: "#41536d", roof: "#6f3434", n: "Cottage" },
      { x: 16, z: 13, w: 5.4, h: 3.4, d: 5.4, c: "#41536d", roof: "#6f3434", n: "Cottage" },
      { x: -30, z: -16, w: 6, h: 4, d: 6, c: "#33445c", roof: "#6f3434", n: "Watchtower" },
      { x: 34, z: -16, w: 6, h: 4, d: 6, c: "#33445c", roof: "#6f3434", n: "Watchtower" },
    ];
    const targets: THREE.Object3D[] = [body, door];
    houses.forEach((h) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(h.w, h.h, h.d), toon(h.c));
      b.position.set(h.x, h.h / 2, h.z);
      b.castShadow = b.receiveShadow = true;
      b.userData.room = h.n;
      scene.add(b);
      targets.push(b);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(h.w * 0.84, 3.1, 4), toon(h.roof));
      roof.position.set(h.x, h.h + 1.5, h.z);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      scene.add(roof);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(h.w * 0.5, 1.1, 4), toon("#f4f9ff"));
      cap.position.set(h.x, h.h + 2.9, h.z);
      cap.rotation.y = Math.PI / 4;
      scene.add(cap);
      for (let k = 0; k < 2; k++) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.3, 0.16), new THREE.MeshBasicMaterial({ color: "#ffd489" }));
        win.position.set(h.x - 1.4 + k * 2.8, h.h * 0.55, h.z + h.d / 2 + 0.1);
        scene.add(win);
      }
    });

    // stalls
    const stall = (x: number, z: number, col: string) => {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      scene.add(g);
      [[-0.9, 0], [0.9, 0], [-0.9, -1.1], [0.9, -1.1]].forEach(([px, pz]) => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.1, 8), toon("#6b4a2a"));
        p.position.set(px, 1.05, pz);
        p.castShadow = true;
        g.add(p);
      });
      const awn = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 1.6), toon(col));
      awn.position.set(0, 2.15, -0.55);
      awn.rotation.x = -0.16;
      awn.castShadow = true;
      g.add(awn);
      const table = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 1), toon("#7a5530"));
      table.position.set(0, 0.92, -0.55);
      g.add(table);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: "#ffd489" }));
      lamp.position.set(0, 1.75, 0.05);
      g.add(lamp);
      const pl = new THREE.PointLight("#ffbe66", 1.4, 7, 2);
      pl.position.set(0, 1.8, 0);
      g.add(pl);
    };
    stall(-9, 8, "#c2453f");
    stall(9, 8, "#2f7f6a");

    // trees
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 28;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const t = new THREE.Group();
      t.position.set(x, 0, z);
      scene.add(t);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.34, 1.7, 6), toon("#4a3628"));
      trunk.position.y = 0.85;
      trunk.castShadow = true;
      t.add(trunk);
      for (let k = 0; k < 3; k++) {
        const c = new THREE.Mesh(new THREE.ConeGeometry(2.1 - k * 0.5, 2.3, 7), toon(k === 2 ? "#2f6350" : "#224a3b"));
        c.position.y = 2 + k * 1.1;
        c.castShadow = true;
        t.add(c);
      }
      const cap = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1, 7), toon("#f0f6fd"));
      cap.position.y = 4.6;
      t.add(cap);
      t.scale.setScalar(0.85 + Math.random() * 0.45);
    }

    // lamps
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x = Math.cos(a) * 14;
      const z = Math.sin(a) * 14;
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 4.2, 8), toon("#2a3546"));
      p.position.set(x, 2.1, z);
      p.castShadow = true;
      scene.add(p);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), new THREE.MeshBasicMaterial({ color: "#ffe3ab" }));
      head.position.set(x, 4.3, z);
      scene.add(head);
      const pl = new THREE.PointLight("#ffbe66", 2, 12, 2);
      pl.position.set(x, 4.3, z);
      scene.add(pl);
      const pool = new THREE.Mesh(new THREE.CircleGeometry(2.3, 24), new THREE.MeshBasicMaterial({ color: "#ffcf8a", transparent: true, opacity: 0.14 }));
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(x, 0.04, z);
      scene.add(pool);
    }

    // snowman + cat
    const sm = new THREE.Group();
    sm.position.set(-10.5, 0, 5.5);
    scene.add(sm);
    [[1, 0], [0.76, 1.6], [0.54, 2.62]].forEach(([r, y]) => {
      const b = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 14), toon("#f6faff"));
      b.position.y = y;
      b.castShadow = true;
      sm.add(b);
    });
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.6, 8), toon("#ff9a3c"));
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 2.68, 0.54);
    sm.add(nose);

    const cat = new THREE.Group();
    cat.position.set(10, 0, 6);
    cat.rotation.y = -0.7;
    scene.add(cat);
    const cb = new THREE.Mesh(new THREE.SphereGeometry(0.46, 14, 12), toon("#191d27"));
    cb.scale.set(1, 0.8, 1.45);
    cb.position.y = 0.44;
    cat.add(cb);
    const ch = new THREE.Mesh(new THREE.SphereGeometry(0.31, 14, 12), toon("#191d27"));
    ch.position.set(0, 0.82, 0.44);
    cat.add(ch);
    [-0.16, 0.16].forEach((x) => {
      const e = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 4), toon("#191d27"));
      e.position.set(x, 1.08, 0.44);
      cat.add(e);
    });

    // characters
    const outfits = ["#3b7bd6", "#c2453f", "#4aa36a", "#a45ac2"];
    const chars: { grp: THREE.Group; legs: THREE.Mesh[]; arms: THREE.Mesh[] }[] = [];
    const mkChar = (x: number, z: number, i: number) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);
      scene.add(grp);
      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.66, 4, 12), toon(outfits[i % 4]));
      torso.position.y = 1.3;
      torso.castShadow = true;
      grp.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.37, 18, 16), toon("#e8b98d"));
      head.position.y = 2.06;
      head.castShadow = true;
      grp.add(head);
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.39, 18, 12, 0, 6.3, 0, 1.45), toon("#241a14"));
      hair.position.y = 2.1;
      grp.add(hair);
      const legs: THREE.Mesh[] = [];
      const arms: THREE.Mesh[] = [];
      [-0.2, 0.2].forEach((lx) => {
        const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.58, 3, 8), toon("#2a3346"));
        l.position.set(lx, 0.5, 0);
        l.castShadow = true;
        grp.add(l);
        legs.push(l);
      });
      [-0.48, 0.48].forEach((ax) => {
        const a2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.54, 3, 8), toon(outfits[i % 4]));
        a2.position.set(ax, 1.32, 0);
        grp.add(a2);
        arms.push(a2);
      });
      chars.push({ grp, legs, arms });
    };
    mkChar(0, 3, 0);
    mkChar(-3, 4.4, 1);
    mkChar(3.2, 3.6, 2);
    mkChar(-5.5, 1.5, 3);

    // snow
    const N = 900;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 105;
      pos[i * 3 + 1] = Math.random() * 46;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 105;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: "#f2f8ff", size: 0.2, transparent: true, opacity: 0.95 })));

    // input
    let drag = false, px = 0, py = 0;
    const cv = renderer.domElement;
    cv.addEventListener("pointerdown", (e) => { drag = true; px = e.clientX; py = e.clientY; });
    window.addEventListener("pointerup", () => { drag = false; });
    cv.addEventListener("pointermove", (e) => {
      if (!drag) return;
      theta -= (e.clientX - px) * 0.006;
      phi = Math.max(0.4, Math.min(1.2, phi + (e.clientY - py) * 0.004));
      px = e.clientX; py = e.clientY;
      place();
    });
    cv.addEventListener("wheel", (e) => {
      e.preventDefault();
      rad = Math.max(16, Math.min(46, rad + e.deltaY * 0.02));
      place();
    }, { passive: false });

    const keys: Record<string, boolean> = {};
    const kd = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; };
    const ku = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    cv.addEventListener("click", (e) => {
      const r = cv.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(mouse, cam);
      const hit = ray.intersectObjects(targets, true)[0];
      if (hit) {
        let o: THREE.Object3D | null = hit.object;
        while (o && !o.userData.room) o = o.parent;
        const room = o?.userData.room;
        if (room) {
          setToast(`entering ${room}`);
          setTimeout(() => setToast(""), 1600);
        }
      }
    });

    const resize = () => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      cam.aspect = r.width / r.height;
      cam.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let walk = 0;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      let mx = 0, mz = 0;
      if (keys.w || keys.arrowup) mz -= 1;
      if (keys.s || keys.arrowdown) mz += 1;
      if (keys.a || keys.arrowleft) mx -= 1;
      if (keys.d || keys.arrowright) mx += 1;
      const me = chars[0];
      if (mx || mz) {
        const len = Math.hypot(mx, mz);
        me.grp.position.x = Math.max(-12, Math.min(22, me.grp.position.x + (mx / len) * 0.09));
        me.grp.position.z = Math.max(-10, Math.min(12, me.grp.position.z + (mz / len) * 0.09));
        me.grp.rotation.y = Math.atan2(mx, mz) + Math.PI;
        walk += 0.09;
      } else {
        walk += 0.012;
      }
      setCoords(`${Math.round(me.grp.position.x)}, ${Math.round(me.grp.position.z)}`);
      me.legs.forEach((l, k) => { l.rotation.x = Math.sin(walk * 12 + k * 3.14) * (mx || mz ? 0.6 : 0.04); });
      me.arms.forEach((a, k) => { a.rotation.x = Math.sin(walk * 12 + k * 3.14 + 1.5) * (mx || mz ? 0.5 : 0.05); });
      chars.slice(1).forEach((c, i) => {
        const a = t * 0.22 + i * 2.1;
        const r = 4.5 + i * 1.5;
        c.grp.position.set(Math.cos(a) * r, 0, 2.5 + Math.sin(a) * r);
        c.grp.rotation.y = -a + Math.PI / 2;
        c.legs.forEach((l, k) => { l.rotation.x = Math.sin(t * 7 + k * 3.14) * 0.55; });
      });
      signLight.intensity = 2.6 + Math.sin(t * 3) * 0.5;
      for (let i = 0; i < SP; i++) {
        spPos[i * 3] += spVel[i][0];
        spPos[i * 3 + 1] += spVel[i][1];
        spPos[i * 3 + 2] += spVel[i][2];
        spVel[i][1] -= 0.004;
        if (spPos[i * 3 + 1] < 0.8) {
          spPos[i * 3] = (Math.random() - 0.5) * 0.5;
          spPos[i * 3 + 1] = 2.9;
          spPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
          spVel[i] = [(Math.random() - 0.5) * 0.06, Math.random() * 0.09 + 0.05, (Math.random() - 0.5) * 0.06];
        }
      }
      spGeo.attributes.position.needsUpdate = true;
      const p = sg.attributes.position;
      for (let i = 0; i < N; i++) {
        p.array[i * 3 + 1] -= 0.05 + (i % 5) * 0.008;
        if (p.array[i * 3 + 1] < 0) p.array[i * 3 + 1] = 46;
      }
      p.needsUpdate = true;
      renderer.render(scene, cam);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0a0f18]">
      <div ref={mount} className="absolute inset-0" />
      {toast && (
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded border border-[#4a3c26] bg-[#141009ee] px-3 py-1.5 text-[11px] font-bold text-[#f0e4c6]">
          {toast}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded border border-[#4a3c26] bg-[#141009cc] px-2 py-1 font-mono text-[10px] text-[#c9b68a]">
        {coords}
      </div>
    </div>
  );
}