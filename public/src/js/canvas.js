var Particle = function(x, y, hue){
    this.x = x;
    this.y = y;
    this.coordLast = [
        {x: x, y: y},
        {x: x, y: y},
        {x: x, y: y}
    ];
    this.angle = rand(0, 360);
    this.speed = rand(((self.partSpeed - self.partSpeedVariance) <= 0) ? 1 : self.partSpeed - self.partSpeedVariance, (self.partSpeed + self.partSpeedVariance));
    this.friction = 1 - self.partFriction/100;
    this.gravity = self.partGravity/2;
    this.hue = rand(hue-self.hueVariance, hue+self.hueVariance);
    this.brightness = rand(50, 80);
    this.alpha = rand(40,100)/100;
    this.decay = rand(10, 50)/1000;
    this.wind = (rand(0, self.partWind) - (self.partWind/2))/25;
    this.lineWidth = self.lineWidth;
};

Particle.prototype.update = function(index){
    var radians = this.angle * Math.PI / 180;
    var vx = Math.cos(radians) * this.speed;
    var vy = Math.sin(radians) * this.speed + this.gravity;
    this.speed *= this.friction;

    this.coordLast[2].x = this.coordLast[1].x;
    this.coordLast[2].y = this.coordLast[1].y;
    this.coordLast[1].x = this.coordLast[0].x;
    this.coordLast[1].y = this.coordLast[0].y;
    this.coordLast[0].x = this.x;
    this.coordLast[0].y = this.y;

    this.x += vx * self.dt;
    this.y += vy * self.dt;

    this.angle += this.wind;
    this.alpha -= this.decay;

    if(!hitTest(0,0,self.cw,self.ch,this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2) || this.alpha < .05){
        self.particles.splice(index, 1);
    }
};

Particle.prototype.draw = function(){
    var coordRand = (rand(1,3)-1);
    self.ctx.beginPath();
    self.ctx.moveTo(Math.round(this.coordLast[coordRand].x), Math.round(this.coordLast[coordRand].y));
    self.ctx.lineTo(Math.round(this.x), Math.round(this.y));
    self.ctx.closePath();
    self.ctx.strokeStyle = 'hsla('+this.hue+', 100%, '+this.brightness+'%, '+this.alpha+')';
    self.ctx.stroke();

    if(self.flickerDensity > 0){
        var inverseDensity = 50 - self.flickerDensity;
        if(rand(0, inverseDensity) === inverseDensity){
            self.ctx.beginPath();
            self.ctx.arc(Math.round(this.x), Math.round(this.y), rand(this.lineWidth,this.lineWidth+3)/2, 0, Math.PI*2, false)
            self.ctx.closePath();
            var randAlpha = rand(50,100)/100;
            self.ctx.fillStyle = 'hsla('+this.hue+', 100%, '+this.brightness+'%, '+randAlpha+')';
            self.ctx.fill();
        }
    }
};