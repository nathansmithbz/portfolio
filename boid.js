let boids = [];
let predators = [];

let lines = false;
let predLines = false;
let flockSize;
let flockSizeAverage;
let time;
let numBoids = 20;
let numPreds = 1;

function setup(){
  let canvas; 
  if (windowWidth <= 440) {
    canvas = createCanvas(200, 200);
  }else if(windowWidth < 770){
  canvas = createCanvas(300, 300);
  }else{
  canvas = createCanvas(500, 500);
}
  canvas.parent("boidCanvas");
  for(let i = 0; i < numBoids; i++){
    append(boids, new Boid(random(width),random(height)));
  }
  for(let i = 0; i < numPreds; i++){
    append(predators, new Predator(random(width),random(height),random(90,150)));
   //predators.add(new Predator(random(width),random(height), random(90,150))); 
  }
}

function draw(){
  background(255);
  for(let i = 0; i < boids.length; i++){
    boid = boids[i];
    boid.matchv(boids,boid);
    boid.flock(boids,boid);
    boid.avoid(boids,boid);
    for(let b = 0; b < predators.length; b++){
      predator = predators[b];
      boid.runAway(boid,predator);
    }
    boid.stayOnScreen();
    boid.update();
    boid.display(); 
  }
    for(let i = 0; i < predators.length; i++){     
      predator = predators[i];
      predator.chase(boids, predator);
      predator.stayOnScreen();
      predator.update();
      predator.display();
    } 
    fill(0);
    if(lines){
    text("Boid flock network ON", 10, 40);
    }
    if(predLines){
    text("Predator chase network ON", 10, 20);
    }
    
  flockSizeAverage = flockSize/150;
  flockSize = 0;
  time++;
  }
function keyPressed() {
 if(key == '=' | key == '+'){
    append(predators, new Predator(random(width),random(height),random(90,150)));
 }
   if(key == '-' | key == '_'){
     predators.pop();
 }
 if(key == ',' | key == '<'){
  boids.pop();
}
if(key == '.' | key == '>'){
  append(boids, new Boid(random(width),random(height)));
}

  if(key == 'p' | key == 'P'){
   if(predLines == true){
    predLines = false; 
   }else{
    predLines = true; 
   }
 }
   if(key == 'b' | key == 'B'){
   if(lines == true){
    lines = false; 
   }else{
    lines = true; 
   }
 }
}
class Predator{
   constructor(Xpos, Ypos, areaI){ 
    this.pos = createVector(Xpos, Ypos);
    this.vel = createVector(0, 0);
    this.area = areaI;
    this.ruleVel = createVector(0, 0);
  }
  display(){
    stroke(255,0,0);
    fill(255,0,0);
    ellipse(this.pos.x, this.pos.y, 10, 10);    
  }
  chase(boids_, predator_){
     let test = false;
     let num = 0;
     let tmp = createVector(0,0);
     let dist;
     let b1;
    for(let i = 0; i < boids_.length; i++){
      b1 = boids_[i];
      dist = p5.Vector.dist(predator_.pos, b1.pos);
      if(dist < predator_.area && dist > 0){
        tmp.add(b1.pos);
        num++;
        if(predLines && num > 1){
          stroke(0,0,255);
          strokeWeight(0.5);
          line(b1.pos.x,b1.pos.y,predator_.pos.x, predator_.pos.y);
        }
      }
    }
    if(num > 1){
      tmp.div(num);
      tmp.sub(predator_.pos);
      tmp.normalize();
      }
      tmp.mult(1.5);
      tmp.limit(0.4);
      predator_.ruleVel.add(tmp);
   }
  
  stayOnScreen(){
    if (this.pos.x > width+5){
      this.pos.x = -5;
    }
    if (this.pos.y > height+5){
      this.pos.y = -5;
    }
    if (this.pos.x < -5){
      this.pos.x = width+5;
    }
    if (this.pos.y < -5){
      this.pos.y = height+5;
    }
  }
  update(){
    this.vel.add(this.ruleVel);
    this.vel.limit(1.7);
    this.pos.add(this.vel);
    this.ruleVel = createVector(0,0);
   }
}

class Boid{ 
   constructor(Xpos, Ypos){ 
    this.pos = createVector(Xpos, Ypos);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.ruleVel = createVector(0, 0);
  }

  display(){
    stroke(0);
    fill(0);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + radians(90));
    beginShape(TRIANGLES);
    vertex(0, -7);vertex(-5, 5);vertex(2, 5);
    endShape();
    pop();
  }
  matchv(boids_, boid_){
    let tmp = createVector(0,0);
    let dist1 = boid_.pos;
    let dist;
    let b1;
    let num = 0;
    for(let i = 0; i < boids_.length; i++){
      b1 = boids_[i];
      dist = p5.Vector.dist(boid_.pos, b1.pos);
      if(b1 != boid_ && dist < 75 && dist > 0){
        tmp.add(b1.vel);
        num++;
      }
    }
     if(num > 0){
        tmp.normalize();
        tmp.div(num);
     }
    tmp.mult(1.5);
    tmp.limit(0.02);
    boid_.ruleVel.add(tmp);
    
  }
  
   flock(boids_, boid_){
     let test = false;
     let num = 0;
     let b1;
       let tmp = createVector(0,0);
       let dist;
    for(let i = 0; i < boids_.length; i++){
      b1 = boids_[i];
      dist = p5.Vector.dist(boid_.pos, b1.pos);
      if(b1 != boid_ && dist < 100 && dist > 0){
        if(lines){
          stroke(0,255,0);
          strokeWeight(0.5);
          line(b1.pos.x, b1.pos.y, boid_.pos.x,boid_.pos.y);
        }
        tmp.add(b1.pos);
        num++;
      }
    }
    if(num > 0){
      flockSize+=num;
      tmp.div(num);
      tmp.sub(boid_.pos);
      tmp.normalize();
      }
      tmp.mult(1.5);
      tmp.limit(0.01);
      boid_.ruleVel.add(tmp);
   }
  
  avoid(boids_, boid_){
    let tmp = createVector(0,0);
    let dist;
    let count = 0;
    let b1;
    for(let i = 0; i < boids_.length; i++){
      let dist1;
      b1 = boids_[i];
      if(b1 != boid_){
        dist = p5.Vector.dist(boid_.pos, b1.pos);
        if(dist < 22 && dist > 0){    //remove > 0 ?!?!?!?
          dist1 = p5.Vector.sub(boid_.pos, b1.pos);
          dist1.div(dist);
          tmp.add(dist1);
          count++;
        }
      }
    }
    if(count > 0){
     tmp.div(count); 
    }
    tmp.normalize();
    tmp.mult(2);
    tmp.limit(0.09);
    boid_.ruleVel.add(tmp);
  }
  runAway(boid_, predator_){
    let dist = p5.Vector.dist(boid_.pos, predator_.pos);
        if(dist < 50 && dist > 0){
           let tmp = createVector(0,0);
           tmp.add(predator_.pos);
           tmp.sub(boid_.pos);
           tmp.normalize();
           tmp.mult(2);
           tmp.limit(0.05);
           tmp.mult(-3);
           boid_.ruleVel.add(tmp);  
        } 
  }
 stayOnScreen(){
    if (this.pos.x > width+5){
      this.pos.x = -5;
    }
    if (this.pos.y > height+5){
      this.pos.y = -5;
    }
    if (this.pos.x < -5){
      this.pos.x = width+5;
    }
    if (this.pos.y < -5){
      this.pos.y = height+5;
    }
  }
   update(){
    this.vel.add(this.ruleVel);
    this.vel.limit(1.5);
    this.pos.add(this.vel);
    this.ruleVel = createVector(0,0);
    
   }
}
  